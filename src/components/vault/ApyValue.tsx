export function ApyValue({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">--</span>
  return <span>{value.toFixed(2)}%</span>
}
