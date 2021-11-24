const original = '1b9a42a1a081d9722a0e15010f7dcc99fb77c1896b61085b9fa4efc4f2ce'
const numberToString = Number.prototype.toString
const toHex = (n) => numberToString.call(n, 16)


for (const attempt of getNibbleInserts()) {
  console.log(attempt)
}

function applyChunks (chunks, values) {
  let result = ''
  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    const chunk = chunks[index]
    result += chunk + value
  }
  result += chunks[chunks.length - 1]
  return result
}

function* insertNibblesAtPositions (pos) {
  const chunks = []
  let lastIndex = 0
  // fine to sort
  pos.sort()
  // console.log('pos', pos)
  for (const index of pos) {
    // offset but number of inserts already done
    const offset = chunks.length
    chunks.push(original.slice(offset + lastIndex, offset + index))
    lastIndex = index
  }
  chunks.push(original.slice(lastIndex))
  // chunks prepared except for last
  for (const nibbleValues of getEachInDimensions(pos.length, 16)) {
    // console.log('nibbleValues', nibbleValues)
    const nibbleChars = nibbleValues.map(toHex)
    const attempt = applyChunks(chunks, nibbleChars)
    yield attempt
  }
}

function * getNibbleInserts () {
  for (const pos of getEachInDimensions(4, 60)) {
    let copy = original
    yield* insertNibblesAtPositions(pos)
  }
}

function * getEachInDimensions (space, size, index = 0) {
  const max = size ** space
  const pos = new Array(space)
  while(index < max) {
    for (let column = 0; column < space; column++) {
      pos[column] = Math.floor(index / (size ** column)) % size
    }
    yield pos
    index++
  }
}