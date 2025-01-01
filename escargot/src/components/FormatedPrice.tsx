import { cn } from "@/lib/utils";
import styles from './Product.module.css';

type Props = {
  amount?: number;  // amount est optionnel
  className?: string; // classe optionnelle pour le style
  price?: number; // prix optionnel
};

const FormattedPrice = ({ amount, className, price }: Props) => {
  // Assurez-vous que la valeur soit un nombre (si price ou amount sont undefined, on utilise 0)
  const valueToFormat = price !== undefined ? price : amount ?? 0;

  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueToFormat);

  return (
    <span className={cn(styles.price, className)}>
      {formattedAmount}
    </span>
  );
};

export default FormattedPrice;
