export function hasAllKeys(thing, keys) {
  return keys.every(key => thing.hasOwnProperty(key))
}
