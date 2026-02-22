import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Crop, X, Check, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

export default function ImageCropper({ onImageCropped, currentImage, label = 'Upload Image', aspectRatio = null, circular = false }) {
    const [originalImage, setOriginalImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Crop state
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [cropArea, setCropArea] = useState({ x: 50, y: 50, w: 200, h: 200 });
    const [dragging, setDragging] = useState(null); // null | 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });

    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setOriginalImage(ev.target.result);
            setShowCropper(true);
            setImgLoaded(false);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleImageLoad = useCallback(() => {
        const img = imgRef.current;
        if (!img || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const scale = Math.min(containerRect.width / img.naturalWidth, containerRect.height / img.naturalHeight, 1);
        const displayW = img.naturalWidth * scale;
        const displayH = img.naturalHeight * scale;

        setImgDimensions({ w: displayW, h: displayH, naturalW: img.naturalWidth, naturalH: img.naturalHeight, scale });

        // Initialize crop area centered
        const cropSize = Math.min(displayW, displayH) * 0.7;
        const cropW = aspectRatio ? cropSize : cropSize;
        const cropH = aspectRatio ? cropSize / aspectRatio : cropSize;
        setCropArea({
            x: (displayW - cropW) / 2,
            y: (displayH - cropH) / 2,
            w: cropW,
            h: cropH,
        });

        setImgLoaded(true);
    }, [aspectRatio]);

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const handleMouseDown = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(type);
        const rect = containerRef.current.getBoundingClientRect();
        setDragStart({
            x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
            y: (e.clientY || e.touches?.[0]?.clientY) - rect.top,
            cropX: cropArea.x,
            cropY: cropArea.y,
            cropW: cropArea.w,
            cropH: cropArea.h,
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (!dragging || !containerRef.current) return;
        e.preventDefault();

        const rect = containerRef.current.getBoundingClientRect();
        const cx = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const cy = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        const dx = cx - dragStart.x;
        const dy = cy - dragStart.y;

        const minSize = 40;

        setCropArea((prev) => {
            let { x, y, w, h } = { ...prev };

            if (dragging === 'move') {
                x = clamp(dragStart.cropX + dx, 0, imgDimensions.w - w);
                y = clamp(dragStart.cropY + dy, 0, imgDimensions.h - h);
            } else if (dragging === 'se') {
                w = clamp(dragStart.cropW + dx, minSize, imgDimensions.w - x);
                h = aspectRatio ? w / aspectRatio : clamp(dragStart.cropH + dy, minSize, imgDimensions.h - y);
            } else if (dragging === 'sw') {
                const newW = clamp(dragStart.cropW - dx, minSize, dragStart.cropX + dragStart.cropW);
                x = dragStart.cropX + dragStart.cropW - newW;
                w = newW;
                h = aspectRatio ? w / aspectRatio : clamp(dragStart.cropH + dy, minSize, imgDimensions.h - y);
            } else if (dragging === 'ne') {
                w = clamp(dragStart.cropW + dx, minSize, imgDimensions.w - x);
                const newH = aspectRatio ? w / aspectRatio : clamp(dragStart.cropH - dy, minSize, dragStart.cropY + dragStart.cropH);
                y = aspectRatio ? y : dragStart.cropY + dragStart.cropH - newH;
                h = newH;
            } else if (dragging === 'nw') {
                const newW = clamp(dragStart.cropW - dx, minSize, dragStart.cropX + dragStart.cropW);
                const newH = aspectRatio ? newW / aspectRatio : clamp(dragStart.cropH - dy, minSize, dragStart.cropY + dragStart.cropH);
                x = dragStart.cropX + dragStart.cropW - newW;
                y = aspectRatio ? dragStart.cropY + dragStart.cropH - newH : dragStart.cropY + dragStart.cropH - newH;
                w = newW;
                h = newH;
            } else if (dragging === 'n') {
                const newH = clamp(dragStart.cropH - dy, minSize, dragStart.cropY + dragStart.cropH);
                y = dragStart.cropY + dragStart.cropH - newH;
                h = newH;
                if (aspectRatio) w = h * aspectRatio;
            } else if (dragging === 's') {
                h = clamp(dragStart.cropH + dy, minSize, imgDimensions.h - y);
                if (aspectRatio) w = h * aspectRatio;
            } else if (dragging === 'e') {
                w = clamp(dragStart.cropW + dx, minSize, imgDimensions.w - x);
                if (aspectRatio) h = w / aspectRatio;
            } else if (dragging === 'w') {
                const newW = clamp(dragStart.cropW - dx, minSize, dragStart.cropX + dragStart.cropW);
                x = dragStart.cropX + dragStart.cropW - newW;
                w = newW;
                if (aspectRatio) h = w / aspectRatio;
            }

            return { x, y, w, h };
        });
    }, [dragging, dragStart, imgDimensions, aspectRatio]);

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleMouseMove);
                window.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [dragging, handleMouseMove, handleMouseUp]);

    const cropAndUpload = async () => {
        if (!imgRef.current || !imgDimensions.scale) return;

        setUploading(true);

        try {
            const canvas = document.createElement('canvas');
            const scaleRatio = 1 / imgDimensions.scale;
            const sx = cropArea.x * scaleRatio;
            const sy = cropArea.y * scaleRatio;
            const sw = cropArea.w * scaleRatio;
            const sh = cropArea.h * scaleRatio;

            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext('2d');

            if (circular) {
                ctx.beginPath();
                ctx.arc(sw / 2, sh / 2, Math.min(sw, sh) / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, sw, sh);

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            const formData = new FormData();
            formData.append('image', blob, 'cropped-image.jpg');

            const token = localStorage.getItem('evoz_token');
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onImageCropped(data.url);
            setShowCropper(false);
            setOriginalImage(null);
        } catch (err) {
            console.error('Crop/upload error:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        onImageCropped('');
    };

    const handleReset = () => {
        if (imgRef.current && imgDimensions.w) {
            const cropSize = Math.min(imgDimensions.w, imgDimensions.h) * 0.7;
            setCropArea({
                x: (imgDimensions.w - cropSize) / 2,
                y: (imgDimensions.h - cropSize) / 2,
                w: cropSize,
                h: aspectRatio ? cropSize / aspectRatio : cropSize,
            });
        }
    };

    return (
        <div className="image-cropper-wrapper">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Upload Area / Preview */}
            {!showCropper && (
                <div className="image-upload-area">
                    {currentImage ? (
                        <div className="image-preview-container">
                            <img
                                src={currentImage}
                                alt="Preview"
                                className={`image-preview ${circular ? 'circular' : ''}`}
                            />
                            <div className="image-preview-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={14} />
                                    Change
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={handleRemoveImage}
                                >
                                    <X size={14} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="image-upload-dropzone"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{label}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                                Click to select or drag and drop
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                                JPEG, PNG, GIF, WEBP (max 10MB)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Crop Modal */}
            {showCropper && originalImage && (
                <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="cropper-modal">
                        <div className="cropper-header">
                            <h3 className="modal-title">
                                <Crop size={18} />
                                Crop Image
                            </h3>
                            <div className="flex gap-8">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={handleReset}
                                    title="Reset crop area"
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => { setShowCropper(false); setOriginalImage(null); }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div
                            className="cropper-container"
                            ref={containerRef}
                            style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}
                        >
                            <img
                                ref={imgRef}
                                src={originalImage}
                                alt="Crop source"
                                onLoad={handleImageLoad}
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    margin: '0 auto',
                                }}
                                draggable={false}
                            />

                            {imgLoaded && (
                                <>
                                    {/* Dark overlay outside crop */}
                                    <div
                                        className="crop-overlay"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: imgDimensions.w,
                                            height: imgDimensions.h,
                                            background: 'rgba(0,0,0,0.6)',
                                            clipPath: `polygon(
                        0% 0%, 100% 0%, 100% 100%, 0% 100%,
                        0% ${cropArea.y}px,
                        ${cropArea.x}px ${cropArea.y}px,
                        ${cropArea.x}px ${cropArea.y + cropArea.h}px,
                        ${cropArea.x + cropArea.w}px ${cropArea.y + cropArea.h}px,
                        ${cropArea.x + cropArea.w}px ${cropArea.y}px,
                        0% ${cropArea.y}px
                      )`,
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    {/* Crop selection box */}
                                    <div
                                        className="crop-selection"
                                        style={{
                                            position: 'absolute',
                                            left: cropArea.x,
                                            top: cropArea.y,
                                            width: cropArea.w,
                                            height: cropArea.h,
                                            border: '2px solid rgba(108, 92, 231, 0.9)',
                                            boxShadow: '0 0 0 1px rgba(255,255,255,0.3), 0 0 20px rgba(108,92,231,0.3)',
                                            borderRadius: circular ? '50%' : '2px',
                                            cursor: 'move',
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, 'move')}
                                        onTouchStart={(e) => handleMouseDown(e, 'move')}
                                    >
                                        {/* Grid lines */}
                                        <div style={{ position: 'absolute', top: '33.3%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                                        <div style={{ position: 'absolute', top: '66.6%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                                        <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                                        <div style={{ position: 'absolute', left: '66.6%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />

                                        {/* Resize handles */}
                                        {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((handle) => {
                                            const styles = {
                                                position: 'absolute',
                                                width: handle.length === 2 ? 14 : (handle === 'n' || handle === 's' ? 24 : 14),
                                                height: handle.length === 2 ? 14 : (handle === 'e' || handle === 'w' ? 24 : 14),
                                                background: 'var(--accent-primary)',
                                                border: '2px solid white',
                                                borderRadius: '2px',
                                                zIndex: 10,
                                            };

                                            const cursorMap = { nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize', n: 'n-resize', s: 's-resize', e: 'e-resize', w: 'w-resize' };
                                            styles.cursor = cursorMap[handle];

                                            if (handle.includes('n')) styles.top = -7;
                                            if (handle.includes('s')) styles.bottom = -7;
                                            if (handle.includes('w')) styles.left = -7;
                                            if (handle.includes('e')) styles.right = -7;
                                            if (handle === 'n' || handle === 's') { styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
                                            if (handle === 'e' || handle === 'w') { styles.top = '50%'; styles.transform = 'translateY(-50%)'; }

                                            return (
                                                <div
                                                    key={handle}
                                                    style={styles}
                                                    onMouseDown={(e) => handleMouseDown(e, handle)}
                                                    onTouchStart={(e) => handleMouseDown(e, handle)}
                                                />
                                            );
                                        })}

                                        {/* Size indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: -28,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'rgba(0,0,0,0.8)',
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            borderRadius: 4,
                                            whiteSpace: 'nowrap',
                                            pointerEvents: 'none',
                                        }}>
                                            {Math.round(cropArea.w / imgDimensions.scale)} x {Math.round(cropArea.h / imgDimensions.scale)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="cropper-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => { setShowCropper(false); setOriginalImage(null); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={cropAndUpload}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Crop & Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
