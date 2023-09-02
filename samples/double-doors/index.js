// @ts-check

import { world } from '@minecraft/server';
/**
 * Automatic Double swing Door
 * @license MIT
 * @author tutinoko2048 / RetoRuto9900K
 * @version 1.20.10
 * --------------------------------------------------------------------------
 * 片方のドアを開くと反対側のドアも開きます
 * --------------------------------------------------------------------------
 */
 
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
];

world.afterEvents.itemUseOn.subscribe(ev => {
  const { source: { dimension }, block } = ev;
  const location = block.location;
  if (!DOOR.includes(block.typeId)) return;
  const isUpper = block.permutation.getState('upper_block_bit');
  if (isUpper === null) return;
  
  const under = { ...location, y: location.y - 1 };
  const lowerBlock = dimension.getBlock(under);
  if (!lowerBlock) return;
  
  const isOpen = isUpper
    ? lowerBlock.permutation.getState('open_bit')
    : block.permutation.getState('open_bit')
  
  const direction = /** @type { number } */ (isUpper
    ? lowerBlock.permutation.getState('direction')
    : block.permutation.getState('direction'))

  if (isOpen === null || direction === null) return;
  
  for (const loc of getNearLocations(isUpper ? under : location, direction)) {
    const _block = dimension.getBlock(loc);
    if (!_block) continue;
    
    const _permutation = _block.permutation.clone();
    const _isOpen = _permutation.getState('open_bit'); // ドア操作前の値
    const _direction = _permutation.getState('direction');
    
    if (block.typeId != _block.typeId || _isOpen === null || _direction === null) continue;
    if (direction != _direction) continue;
    
    const newPermutation = _permutation.withState('open_bit', !isOpen);
    _block.setPermutation(newPermutation);
  }
});
/**
 *
 * @param {import('@minecraft/server').Vector3} loc
 * @param {number} direction
 */
function getNearLocations(loc, direction) {
  return (direction === 0 || direction === 2)
    ? [
      { ...loc, z: loc.z + 1 },
      { ...loc, z: loc.z - 1 }
    ] : [
      { ...loc, x: loc.x + 1 },
      { ...loc, x: loc.x - 1 }
    ]
}
