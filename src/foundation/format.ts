export function formatArray(arr: Array<number>, digits: number = 2): string {
    return (
        "[" +
        arr.map((num) =>
            num.toLocaleString("en", {
                useGrouping: true,
                minimumFractionDigits: digits,
                maximumFractionDigits: digits,
            }),
        )
            .join("  ") +
        "]"
    )
}