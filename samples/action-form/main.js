/**
 * ScriptAPI ActionFormサンプル v1.19.80対応版
 * Made by RetoRuto9900K
 */

import { world, Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

// 特定のアイテムを使った時にFormを開く例
world.events.itemUse.subscribe(event => { // アイテムを使用した時に動くイベント
  if (!(event.source instanceof Player)) return; // プレイヤーでなければ処理を抜ける

  const player = event.source; // 変数に使った人(Player)を代入
  
  if (event.item.typeId === 'minecraft:stick') { // 使ったアイテムのtypeIdが棒だったら
    menu1(player).catch(console.error); // Formを表示
  }
});

// 特定の座標のボタンを押した時にFormを開く例
world.events.buttonPush.subscribe(event => { // ボタンを押した時に動くイベント
  if (!(event.source instanceof Player)) return; // プレイヤーでなければ処理を抜ける
  
  const block = event.block; // 変数に押されたボタン(Block)を代入
  const player = event.source; // 変数に押した人(Player)を代入
  
  const button = { x: 0, y: 10, z: 0 } // 処理を動かすボタンの場所
  // 押されたボタンの座標が一致する時
  if (block.x === button.x && block.y === button.y && block.z === button.z) {
    menu1(player).catch(console.error); // Formを表示
  }
});

/** @param {Player} player */
async function menu1(player) {
  const form = new ActionFormData();
  form.button('ボタン0'); // ボタン追加
  form.button('ボタン1');
  form.button('別のページを開く');

  const { canceled, selection } = await form.show(player); // 表示する selectionに何番目のボタンを押したかが入る
  if (canceled) return; // キャンセルされていたら処理を抜ける
  if (selection === 0) {
    player.sendMessage('ボタン0を選択しました');
    player.runCommandAsync('say コマンドもつかえるよ');
  }
  if (selection === 1) {
    player.sendMessage('ボタン1を選択しました');
  }
  if (selection === 2) {
    await menu2(player); // menu2を表示
  }
}

/** @param {Player} player */
async function menu2(player) {
  const form = new ActionFormData();
  form.button('別のページを開く');
  const { canceled, selection } = await form.show(player);
  if (canceled) return;
  if (selection === 0) {
    await menu1(player); // menu1を表示(戻る)
  }
}
