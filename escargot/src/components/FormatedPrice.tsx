import { cn } from "@/lib/utils";

type Props = {
  amount: number;
  className?: string;
  price?: number; 
};

const FormattedPrice = ({ amount, className, price }: Props) => {
  const valueToFormat = price !== undefined ? price : amount;
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueToFormat);

  return (
    <span className={cn("text-base text-green-700 font-semibold", className)}>
      {formattedAmount}
    </span>
  );
};
export default FormattedPrice;