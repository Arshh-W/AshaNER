import { forwardRef } from "react";

const LargeButton = forwardRef(
    (
        {
            children,
            onClick,
            type = "button",
            variant = "green",
            disabled = false,
            icon,
            className = "",
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                type={type}
                className={`large-btn ${variant} ${className}`}
                onClick={onClick}
                disabled={disabled}
                {...props}
            >
                {icon && (
                    <span className="button-icon">
                        {icon}
                    </span>
                )}

                <span>{children}</span>
            </button>
        );
    }
);

LargeButton.displayName =
    "LargeButton";

export default LargeButton;