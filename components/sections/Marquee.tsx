export default function Marquee({
    text,
    variant,
    reverse,
}: {
    text: string
    variant: 'outline' | 'solid'
    reverse?: boolean
}) {
    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track" data-reverse={reverse ? '' : undefined}>
                {[0, 1].map((i) => (
                    <span key={i} className="marquee-text" data-style={variant}>
                        {text}
                    </span>
                ))}
            </div>
        </div>
    )
}
