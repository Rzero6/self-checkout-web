import { cn } from "@/lib/utils";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface PaymentOptionProps {
    value: string;
    label: string;
    logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    selected: boolean;
}

export const PaymentOption = ({
    value,
    label,
    logo: Logo,
    selected,
}: PaymentOptionProps) => {
    return (
        <Label
            htmlFor={value}
            className={cn(
                "flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition",
                selected
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground"
            )}
        >
            <RadioGroupItem value={value} id={value} className="sr-only" />

            {/* <img src={logo} alt={label} className="h-10 w-10 object-contain dark:bg-white dark:p-1 rounded" /> */}
            <Logo className="h-10 w-10 text-secondary-foreground" fill="currentColor" />

            <span className="font-medium">{label}</span>
        </Label>
    );
};
