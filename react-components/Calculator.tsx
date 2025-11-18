import { type FC, useEffect, useMemo, useState } from 'react';

export interface MortgageCalculatorValues {
  propertyPriceUF: number;
  downPaymentPercent: number;
  rateAnnualPercent: number;
  years: number;
  rentYieldPercent: number;
  expensesPercent: number;
  ufToClp: number;
}

export interface CalculatorResult {
  downPaymentUF: number;
  downPaymentCLP: number;
  loanAmountUF: number;
  loanAmountCLP: number;
  monthlyDividendUF: number;
  monthlyDividendCLP: number;
  monthlyRentCLP: number;
  expensesCLP: number;
  netFlowCLP: number;
}

export interface CalculatorProps {
  title?: string;
  subtitle?: string;
  initialValues?: Partial<MortgageCalculatorValues>;
  onQuote?: (result: CalculatorResult) => void;
  formatUF?: (value: number) => string;
  formatCLP?: (value: number) => string;
  className?: string;
}

const defaultValues: MortgageCalculatorValues = {
  propertyPriceUF: 2600,
  downPaymentPercent: 20,
  rateAnnualPercent: 4.5,
  years: 30,
  rentYieldPercent: 5.5,
  expensesPercent: 15,
  ufToClp: 36600,
};

const defaultUFFormatter = (value: number) =>
  `${value.toLocaleString('es-CL', { maximumFractionDigits: 0 })} UF`;

const CLP_FORMATTER = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const defaultCLPFormatter = (value: number) => CLP_FORMATTER.format(value);

const computeResult = (values: MortgageCalculatorValues): CalculatorResult => {
  const downPaymentUF = (values.propertyPriceUF * values.downPaymentPercent) / 100;
  const loanAmountUF = Math.max(values.propertyPriceUF - downPaymentUF, 0);
  const monthlyRate = values.rateAnnualPercent / 100 / 12;
  const totalPayments = values.years * 12;

  const monthlyDividendUF = monthlyRate === 0
    ? loanAmountUF / Math.max(totalPayments, 1)
    : (loanAmountUF * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const monthlyDividendCLP = monthlyDividendUF * values.ufToClp;
  const loanAmountCLP = loanAmountUF * values.ufToClp;
  const downPaymentCLP = downPaymentUF * values.ufToClp;
  const monthlyRentCLP =
    (values.propertyPriceUF * values.ufToClp * values.rentYieldPercent) / (100 * 12);
  const expensesCLP = (monthlyRentCLP * values.expensesPercent) / 100;
  const netFlowCLP = monthlyRentCLP - monthlyDividendCLP - expensesCLP;

  return {
    downPaymentUF,
    downPaymentCLP,
    loanAmountUF,
    loanAmountCLP,
    monthlyDividendUF,
    monthlyDividendCLP,
    monthlyRentCLP,
    expensesCLP,
    netFlowCLP,
  };
};

const fields: Array<{
  key: keyof MortgageCalculatorValues;
  label: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}> = [
  { key: 'propertyPriceUF', label: 'Precio propiedad', suffix: 'UF', min: 100, step: 10 },
  { key: 'downPaymentPercent', label: 'Pie', suffix: '%', min: 5, max: 90, step: 1 },
  { key: 'rateAnnualPercent', label: 'Tasa anual', suffix: '%', min: 0, max: 12, step: 0.1 },
  { key: 'years', label: 'Plazo', suffix: 'anos', min: 5, max: 40, step: 1 },
  { key: 'rentYieldPercent', label: 'Yield bruto', suffix: '%', min: 2, max: 10, step: 0.1 },
  { key: 'expensesPercent', label: 'Gastos / vacancia', suffix: '%', min: 0, max: 35, step: 1 },
  { key: 'ufToClp', label: 'Valor UF', suffix: 'CLP', min: 20000, step: 100 },
];

export const Calculator: FC<CalculatorProps> = ({
  title = 'Calculadora de dividendo / flujo',
  subtitle = 'Ajusta los parametros para estimar dividendos, arriendo y flujo neto.',
  initialValues,
  onQuote,
  formatUF = defaultUFFormatter,
  formatCLP = defaultCLPFormatter,
  className,
}) => {
  const [values, setValues] = useState<MortgageCalculatorValues>({
    ...defaultValues,
    ...initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const result = useMemo(() => computeResult(values), [values]);

  useEffect(() => {
    onQuote?.(result);
  }, [result, onQuote]);

  const handleChange = (key: keyof MortgageCalculatorValues, raw: string) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    setValues((prev) => ({ ...prev, [key]: parsed }));
  };

  return (
    <section
      className={cn(
        'rounded-[28px] border border-white/10 bg-[#0E141B] p-6 text-white shadow-[0_20px_60px_rgba(2,6,23,.65)]',
        className
      )}
    >
      <div className="mb-6 space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Simulador</p>
        <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(evt) => evt.preventDefault()}>
          {fields.map(({ key, label, suffix, min, max, step }) => (
            <label key={key as string} className="text-sm">
              <span className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                {label}
                {suffix && <span>{suffix}</span>}
              </span>
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <input
                  type="number"
                  inputMode="decimal"
                  min={min}
                  max={max}
                  step={step ?? 'any'}
                  value={values[key]}
                  onChange={(event) => handleChange(key, event.target.value)}
                  className="w-full bg-transparent text-base font-semibold outline-none"
                />
              </div>
            </label>
          ))}
        </form>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Resultado</p>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-white/60">Pie</dt>
              <dd className="text-lg font-semibold">{formatUF(result.downPaymentUF)}</dd>
              <p className="text-xs text-white/50">{formatCLP(result.downPaymentCLP)}</p>
            </div>
            <div>
              <dt className="text-xs text-white/60">Credito</dt>
              <dd className="text-lg font-semibold">{formatUF(result.loanAmountUF)}</dd>
              <p className="text-xs text-white/50">{formatCLP(result.loanAmountCLP)}</p>
            </div>
            <div>
              <dt className="text-xs text-white/60">Dividendo mensual</dt>
              <dd className="text-2xl font-semibold text-[#35E1A6]">{formatCLP(result.monthlyDividendCLP)}</dd>
              <p className="text-xs text-white/50">{result.monthlyDividendUF.toFixed(2)} UF</p>
            </div>
            <div className="grid gap-2 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Arriendo estimado</span>
                <span>{formatCLP(result.monthlyRentCLP)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Gastos / vacancia</span>
                <span>-{formatCLP(result.expensesCLP)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-white">
                <span>Flujo neto</span>
                <span className={result.netFlowCLP >= 0 ? 'text-[#35E1A6]' : 'text-[#F87171]'}>
                  {formatCLP(result.netFlowCLP)}
                </span>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
