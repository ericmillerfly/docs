/**
 * 计算计费重量（chargeable weight）。
 *
 * 规则：
 *  - 实际重量：以千克 (kg) 计。
 *  - 体积重量：长 × 宽 × 高 (cm) ÷ 除数（默认 9000）得到的千克数。
 *  - 计费重量取两者中较大者；据此判断是「按千克」还是「按体积」计费。
 *
 * @param {number} actualKg 实际重量（千克）
 * @param {number} l 长 (cm)
 * @param {number} w 宽 (cm)
 * @param {number} h 高 (cm)
 * @param {number} [divisor=9000] 体积重量除数
 * @returns {{actual:number, volumetric:number, chargeable:number, method:'weight'|'volume'}}
 */
function calcShipping(actualKg, l, w, h, divisor = 9000) {
  const volumetric = (l * w * h) / divisor;
  const chargeable = Math.max(actualKg, volumetric);
  // 体积重量严格大于实际重量时才算「按体积」；相等或更小则按千克（实际计量）。
  const method = volumetric > actualKg ? 'volume' : 'weight';
  return { actual: actualKg, volumetric, chargeable, method };
}

// 同时支持在 Node.js 环境中引入做测试。
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcShipping };
}

// 浏览器端交互逻辑（在 Node 环境中 document 不存在，自动跳过）。
if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const round2 = (n) => Math.round(n * 100) / 100;

  function run() {
    const weight = parseFloat($('weight').value);
    const l = parseFloat($('length').value);
    const w = parseFloat($('width').value);
    const h = parseFloat($('height').value);
    const divisor = parseFloat($('divisor').value);
    const box = $('result');

    const nums = [weight, l, w, h, divisor];
    if (nums.some((n) => isNaN(n) || n < 0) || divisor <= 0) {
      box.className = 'result show error';
      box.textContent = '请填写所有字段，且数值需为非负数（除数需大于 0）。';
      return;
    }

    const r = calcShipping(weight, l, w, h, divisor);
    const byVolume = r.method === 'volume';

    box.className = 'result show';
    box.innerHTML = `
      <div class="rows">
        <div class="row ${byVolume ? '' : 'winner'}">
          <span class="label">实际重量</span>
          <span class="val">${round2(r.actual)} kg</span>
        </div>
        <div class="row ${byVolume ? 'winner' : ''}">
          <span class="label">体积重量 (${l}×${w}×${h} ÷ ${divisor})</span>
          <span class="val">${round2(r.volumetric)} kg</span>
        </div>
      </div>
      <div class="summary">
        <div>计费重量</div>
        <div class="big">${round2(r.chargeable)} kg</div>
        <div class="by">${byVolume ? '按体积计费' : '按千克计费'}</div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('calcBtn').addEventListener('click', run);
    document.querySelectorAll('input').forEach((el) =>
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') run();
      })
    );
  });
}
