// @ts-check

import { world } from '@minecraft/server';
/**
 * Automatic Double swing Door
 * @license MIT
 * @author tutinoko2048 / RetoRuto9900K
 * @version 1.19.80
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

world.events.itemUseOn.subscribe(ev => {
  const { source: { dimension } } = ev;
  const location = ev.getBlockLocation();
  const block = dimension.getBlock(location);
  if (!DOOR.includes(block.typeId)) return;
  const isUpper = block.permutation.getProperty('upper_block_bit');
  if (isUpper === null) return;
  
  const under = { ...location, y: location.y - 1 };
  
  const isOpen = isUpper
    ? dimension.getBlock(under).permutation.getProperty('open_bit')
    : block.permutation.getProperty('open_bit')
  
  const direction = /** @type { number } */ (isUpper
    ? dimension.getBlock(under).permutation.getProperty('direction')
    : block.permutation.getProperty('direction'))

  if (isOpen === null || direction === null) return;
  
  for (const loc of getNearLocations(isUpper ? under : location, direction)) {
    const _block = dimension.getBlock(loc);
    const _permutation = _block.permutation.clone();
    const _isOpen = _permutation.getProperty('open_bit'); // ドア操作前の値
    const _direction = _permutation.getProperty('direction');
    
    if (block.typeId != _block.typeId || _isOpen === null || _direction === null) continue;
    if (direction != _direction) continue;
    
    const newPermutation = _permutation.withProperty('open_bit', !isOpen);
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