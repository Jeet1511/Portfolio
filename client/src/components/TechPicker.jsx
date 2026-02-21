import { useState, useRef, useEffect } from 'react';
import techStack, { getTechInfo, categories } from '../data/techStack';
import { Search, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';

export default function TechPicker({ selected = [], onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedCats, setExpandedCats] = useState({});
    const [customInput, setCustomInput] = useState('');
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    const toggleTech = (techName) => {
        if (selected.includes(techName)) {
            onChange(selected.filter((t) => t !== techName));
        } else {
            onChange([...selected, techName]);
        }
    };

    const removeTech = (techName) => {
        onChange(selected.filter((t) => t !== techName));
    };

    const addCustom = () => {
        const name = customInput.trim();
        if (name && !selected.includes(name)) {
            onChange([...selected, name]);
            setCustomInput('');
        }
    };

    const handleCustomKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustom();
        }
    };

    const toggleCategory = (cat) => {
        setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };

    const filteredStack = {};
    const searchLower = search.toLowerCase();
    categories.forEach((cat) => {
        const filtered = techStack[cat].filter(
            (t) => t.name.toLowerCase().includes(searchLower)
        );
        if (filtered.length > 0) filteredStack[cat] = filtered;
    });

    return (
        <div className="tech-picker" ref={dropdownRef}>
            {/* Selected Techs */}
            <div className="tech-selected-list">
                {selected.map((techName) => {
                    const info = getTechInfo(techName);
                    return (
                        <span
                            key={techName}
                            className="tech-badge"
                            style={{ background: info.color, color: info.textColor }}
                        >
                            {info.name}
                            <button
                                type="button"
                                onClick={() => removeTech(techName)}
                                className="tech-badge-remove"
                                style={{ color: info.textColor }}
                            >
                                <X size={11} />
                            </button>
                        </span>
                    );
                })}
                <button
                    type="button"
                    className="tech-add-btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus size={14} />
                    Add Technology
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="tech-dropdown">
                    <div className="tech-dropdown-search">
                        <Search size={14} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search technologies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="tech-dropdown-list">
                        {Object.entries(filteredStack).map(([cat, techs]) => (
                            <div key={cat} className="tech-dropdown-category">
                                <button
                                    type="button"
                                    className="tech-category-header"
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {expandedCats[cat] === false ? (
                                        <ChevronRight size={14} />
                                    ) : (
                                        <ChevronDown size={14} />
                                    )}
                                    <span className="tech-category-name">{cat}</span>
                                    <span className="tech-category-count">{techs.length}</span>
                                </button>

                                {expandedCats[cat] !== false && (
                                    <div className="tech-category-items">
                                        {techs.map((tech) => {
                                            const isSelected = selected.includes(tech.name);
                                            return (
                                                <button
                                                    key={tech.name}
                                                    type="button"
                                                    className={`tech-dropdown-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleTech(tech.name)}
                                                >
                                                    <span
                                                        className="tech-dot"
                                                        style={{ background: tech.color }}
                                                    />
                                                    <span className="tech-item-name">{tech.name}</span>
                                                    {isSelected && (
                                                        <span className="tech-check">✓</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {Object.keys(filteredStack).length === 0 && (
                            <div className="tech-dropdown-empty">
                                No technologies found for "{search}"
                            </div>
                        )}
                    </div>

                    {/* Custom tech input */}
                    <div className="tech-custom-input">
                        <input
                            type="text"
                            placeholder="Add custom technology..."
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyDown={handleCustomKeyDown}
                        />
                        <button
                            type="button"
                            onClick={addCustom}
                            disabled={!customInput.trim()}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
