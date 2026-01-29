export function generateMissingKeys(
  key: string,
  value: number,
  total: number
): [string, number][] {
  const keys: [string, string][] = [
    ['won', 'lost'],
    ['accurate', 'inaccurate'],
    ['on_target', 'off_target']
  ]

  const keyToChange = keys.find((pairs) => {
    return key.includes(pairs[0])
  })

  if (!keyToChange) return []

  const unsuccessKey = key.replace(keyToChange[0], keyToChange[1])
  const baseKey = key.replace(keyToChange[0], '').replace(/^_+|_+$/g, '')
  const totalKey = 'total_'.concat(baseKey)
  return [
    [key, value],
    [unsuccessKey, total - value],
    [totalKey, total]
  ]
}
