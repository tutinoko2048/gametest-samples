/**
 *
 * @param {Entity} entity スコアを取得したいエンティティ
 * @param {string} objective スコアボードの名前
 * @returns {number | null} スコアを持っていない場合はnull
 * @example getScore(Entity, 'point');
 */
function getScore(entity, objective) {
  try {
    return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
  } catch {
    return;
  }
}
