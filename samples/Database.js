// @ts-check
// Chest Database v2 made by RetoRuto9900K
// NOTE: Make an instance in or after worldInitialize event
// Make sure the container block is always loaded

import { world, MinecraftBlockTypes, ItemStack, BlockInventoryComponent } from '@minecraft/server';

const DATA_BLOCK = 'minecraft:chest';
const DATA_ITEM = 'minecraft:book';
const DEBUG = false;
const COMPRESS_DATA = true;

const overworld = world.getDimension('overworld');

export class Database {
  /** @param {import('@minecraft/server').Vector3} blockLocation */
  constructor(blockLocation) {
    this.blockLocation = blockLocation;
    try {
      this.block = overworld.getBlock(blockLocation);
    } catch {}
    this.cache = {};
    
    this.fetchTable();
  }
  
  /** @type {import('@minecraft/server').Block} */
  get chest() {
    this.block ??= overworld.getBlock(this.blockLocation);
    if (this.block?.typeId !== DATA_BLOCK) {
      if (DEBUG) console.warn('chest: block not found');
      this.block.setType(MinecraftBlockTypes.get(DATA_BLOCK));
    }
    return this.block;
  }
  
  
  /**
   * @overload
   * @param {typeof import('./FriendManager').TABLES.sentRequests} tableName
   * @param {string} key
   * @returns {string[]}
   *
   * @overload
   * @param {typeof import('./FriendManager').TABLES.gotRequests} tableName
   * @param {string} key
   * @returns {string[]}
   *
   * @overload
   * @param {typeof import('./FriendManager').TABLES.friends} tableName
   * @param {string} key
   * @returns {string[]}
   *
   * @param {string} tableName
   * @param {string} key
   * @returns {any}
   */
  get(tableName, key) {
    return this.getTable(tableName)[key];
  }
  
  /**
   * @param {string} tableName
   * @param {string} key
   * @param {any} value
   * @returns {void}
   */
  set(tableName, key, value) {
    const table = this.getTable(tableName);
    table[key] = value;
    this.setTable(tableName, table);
  }
  
  /**
   * @param {string} tableName
   * @param {string} key
   * @returns {void}
   */
  delete(tableName, key) {
    const table = this.getTable(tableName);
    delete table[key];
    this.setTable(tableName, table);
  }
  
  /**
   * @param {string} tableName
   */
  reset(tableName) {
    this.setTable(tableName, {});
  }
  
  /**
   * @param {string} tableName
   * @returns {string[]}
   */
  keys(tableName) {
    return Object.keys(this.getTable(tableName));
  }
  
  /**
   * @param {string} tableName
   * @returns {any}
   */
  getTable(tableName) {
    if (tableName in this.cache) return this.cache[tableName];
    
    /** @type {BlockInventoryComponent} */
    const { container } = this.chest.getComponent('minecraft:inventory');
    
    const { item } = this.getTableItem(tableName, container);
    if (!item) return {};
    
    const data = item.getLore()[0] ?? '{}';
    try {
      return JSON.parse(data);
    } catch {
      if (DEBUG) console.warn('getTable: Parse error');
      return {}
    }
  }
  
  /**
   * @param {string} tableName
   * @param {object} data
   */
  setTable(tableName, data) {
    this.cache[tableName] = data;
    
    /** @type {BlockInventoryComponent} */
    const { container } = this.chest.getComponent('minecraft:inventory');
    
    let created;
    let { slot, item } = this.getTableItem(tableName, container);
    if (!item || slot === -1) {
      item = this.createItem(tableName);
      created = true;
      if (container.emptySlotsCount === 0) throw Error('No available slot in container');
    }
    item.setLore([ JSON.stringify(data, null, COMPRESS_DATA ? 0 : 2) ]);
    created ? container.addItem(item) : container.setItem(slot, item);
  }
  
  /**
   * @param {string} tableName
   * @param {import('@minecraft/server').Container} container
   * @returns {{ item?: ItemStack, slot: number }}
   */
  getTableItem(tableName, container) {
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item?.typeId === DATA_ITEM && item.nameTag === tableName) return { item, slot: i }
    }
    if (DEBUG) console.warn('getTableItem: Item not found');
    return { item: undefined, slot: -1 }
  }
  
  /**
   * @param {string} tableName
   * @returns {ItemStack}
   */
  createItem(tableName) {
    const book = new ItemStack(DATA_ITEM, 1);
    book.nameTag = tableName;
    book.setLore([ '{}' ]);
    return book;
  }
  
  fetchTable() {
    /** @type {BlockInventoryComponent} */
    const { container } = this.chest.getComponent('minecraft:inventory');
    const fetched = [];
    
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item?.typeId !== DATA_ITEM || !item.nameTag || fetched.includes(item.nameTag)) continue;
      let data = {};
      try {
        data = JSON.parse(item.getLore()[0]);
      } catch {}
      
      this.cache[item.nameTag] = data;
      fetched.push(item.nameTag);
      if (DEBUG) console.warn(`fetched: ${item.nameTag}`);
    }
  }
}
