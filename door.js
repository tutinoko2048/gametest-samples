import { world, BlockLocation } from 'mojang-minecraft';

const DOOR = [
  'minecraft:acacia_door',
  'minecraft:birch_door',
  'minecraft:crimson_door',
  'minecraft:dark_oak_door',
  'minecraft:jungle_door',
  'minecraft:mangrove_door',
  'minecraft:spruce_door',
  'minecraft:warped_door',
  'minecraft:wooden_door'
]

world.events.itemUseOn.subscribe(ev => {
  const { blockLocation, source: { dimension } } = ev;
  const block = dimension.getBlock(blockLocation);
  if (!DOOR.includes(block.id)) return;
  
  const isUpper = block.permutation.getProperty('upper_block_bit')?.value;
  if (isUpper === null) return;
  
  const isOpen = isUpper
    ? dimension.getBlock(blockLocation.offset(0, -1, 0)).permutation.getProperty('open_bit')
    : block.permutation.getProperty('open_bit')
  
  const direction = isUpper
    ? dimension.getBlock(blockLocation.offset(0, -1, 0)).permutation.getProperty('direction')
    : block.permutation.getProperty('direction')
  if (!isOpen || !direction) return;
 
  for (const loc of getNearLocations(isUpper ? blockLocation.offset(0, -1, 0) : blockLocation, direction.value)) {
    const _block = dimension.getBlock(loc);
    const _permutation = _block.permutation.clone();
    const _isOpen = _permutation.getProperty('open_bit'); // ドア操作前の値
    const _direction = _permutation.getProperty('direction');
    
    if (block.id != _block.id || !_isOpen || !_direction) continue;
    if (direction.value != _direction.value) continue;
    
    _isOpen.value = !isOpen.value;
    _block.setPermutation(_permutation);
  }
});

/**
 *
 * @param {BlockLocation} loc
 * @param {number} direction
 */
function getNearLocations(loc, direction) {
  return (direction === 0 || direction === 2)
    ? [
      loc.offset(0, 0, 1),
      loc.offset(0, 0, -1)
    ] : [
      loc.offset(1, 0, 0),
      loc.offset(-1, 0, 0)
    ]
}
