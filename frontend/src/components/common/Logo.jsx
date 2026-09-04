export default function Logo({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 320 320"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="AshaNER logo"
        >
            {/* Outer ring */}
            <circle
                cx="160"
                cy="160"
                r="142"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="8"
            />

            {/* Main leaf */}
            <path
                d="
                    M160 28
                    C105 82 74 132 76 188
                    C78 245 113 278 160 292
                    C207 278 242 245 244 188
                    C246 132 215 82 160 28
                    Z
                "
                fill="#164F38"
            />

            {/* Inner leaf */}
            <path
                d="
                    M160 48
                    C126 91 105 133 106 184
                    C107 226 127 253 160 270
                    C193 253 213 226 214 184
                    C215 133 194 91 160 48
                    Z
                "
                fill="#0D3D2C"
            />

            {/* Central stem */}
            <path
                d="M160 68 C158 132 160 204 160 270"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="7"
                strokeLinecap="round"
            />

            {/* Left branches */}
            <path
                d="M158 130 C138 118 123 106 111 92"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <path
                d="M159 158 C136 145 119 130 105 114"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <path
                d="M159 188 C137 177 120 163 106 148"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Right branches */}
            <path
                d="M161 126 C180 113 196 98 208 82"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="5"
                strokeLinecap="round"
            />

            <path
                d="M161 157 C183 145 201 129 215 111"
                fill="none"
                stroke="#D5B63C"
                strokeWidth="5"
                strokeLinecap="round"
            />

            {/* Small flower */}
            <ellipse
                cx="205"
                cy="143"
                rx="14"
                ry="9"
                fill="#E56F51"
                transform="rotate(-35 205 143)"
            />

            <ellipse
                cx="218"
                cy="153"
                rx="14"
                ry="9"
                fill="#E56F51"
                transform="rotate(25 218 153)"
            />

            <ellipse
                cx="207"
                cy="161"
                rx="12"
                ry="8"
                fill="#E56F51"
                transform="rotate(55 207 161)"
            />

            <circle
                cx="207"
                cy="151"
                r="7"
                fill="#D5B63C"
            />
        </svg>
    );
}