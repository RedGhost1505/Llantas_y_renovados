// components/PriceDisplay.tsx
interface PriceDisplayProps {
    amount: number;
    className?: string;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, className }) => {
    return (
        <span className={className}>
            MX ${formatPrice(amount)}
        </span>
    );
};

export default PriceDisplay;