import React, { useState } from "react";
const EditField = ({ value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        setIsEditing(false);
        if (currentValue !== value) {
            onSave(currentValue);
        }
    };

    return isEditing ? (
        <input
            type="text"
            value={currentValue}
            autoFocus
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSave();
                }
                if (e.key === "Escape") {
                    setIsEditing(false);
                    setCurrentValue(value); // Revert changes
                }
            }}
        />
    ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
            {value}
        </span>
    );
};

export default EditField;
