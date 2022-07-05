import { world } from 'mojang-minecraft';

/**
 * Join-Leave Logger
 * @license MIT
 * @author tutinoko2048 / RetoRuto9900K
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * コンテンツログにプレイヤーの参加退出ログを記録します
 * --------------------------------------------------------------------------
 */

world.events.playerJoin.subscribe(ev => {
  const { player } = ev;
  console.log(`Join >> ${player.name}`);
});

world.events.playerLeave.subscribe(ev => {
  const { playerName } = ev;
  console.log(`Leave >> ${playerName}`);
});
