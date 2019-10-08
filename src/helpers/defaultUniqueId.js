export const defaultUniqueId = (() => {
  let id = 0
  return () => id++
})()
