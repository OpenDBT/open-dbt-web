import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './MathTypeEditor.less'; // 导入自定义样式文件
import { Button } from 'antd';
const MathEditor = ({onInsertFormula} ) => {
  const [editorContent, setEditorContent] = useState('');

  // 处理插入数学公式的函数
  const handleInsertFormula = (latex) => {
    setEditorContent(editorContent + latex);
  };
// 处理确认插入数学公式的函数
const handleConfirmInsert = () => {
  onInsertFormula(editorContent);
  setEditorContent('');
};
  return (
    <div className="editor-container">
      <h2>数学公式编辑器</h2>
      <div>
        <div className="formula-icons-container">
         {/* 第一行数学公式选择列表 */}
         <div className="formula-row">
          <div className="formula-icon" onClick={() => handleInsertFormula('\\sqrt{ }')}>
            <div className="icon-box">√</div>
            <div className="icon-label">根号</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('x^{ }')}>
            <div className="icon-box">xⁱ</div>
            <div className="icon-label">上标</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('x_{ }')}>
            <div className="icon-box">xₓ</div>
            <div className="icon-label">下标</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\infty')}>
            <div className="icon-box">∞</div>
            <div className="icon-label">无穷大</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\sum_{ }^{ }')}>
            <div className="icon-box">Σ</div>
            <div className="icon-label">求和</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\prod_{ }^{ }')}>
            <div className="icon-box">Π</div>
            <div className="icon-label">乘积</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\equiv')}>
            <div className="icon-box">≡</div>
            <div className="icon-label">同余</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\partial')}>
            <div className="icon-box">∂</div>
            <div className="icon-label">微分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathrm{d}x')}>
            <div className="icon-box">dx</div>
            <div className="icon-label">微分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathbb{N}')}>
            <div className="icon-box">ℕ</div>
            <div className="icon-label">自然数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathbb{Z}')}>
            <div className="icon-box">ℤ</div>
            <div className="icon-label">整数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathbb{Q}')}>
            <div className="icon-box">ℚ</div>
            <div className="icon-label">有理数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathbb{R}')}>
            <div className="icon-box">ℝ</div>
            <div className="icon-label">实数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\mathbb{C}')}>
            <div className="icon-box">ℂ</div>
            <div className="icon-label">复数</div>
          </div>
        </div>
        {/* 第二行数学公式选择列表 */}
        <div className="formula-row">
          <div className="formula-icon" onClick={() => handleInsertFormula('\\frac{ }{ }')}>
            <div className="icon-box">⁄</div>
            <div className="icon-label">分数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\int_{ }^{ }')}>
            <div className="icon-box">∫</div>
            <div className="icon-label">积分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\oint_{ }^{ }')}>
            <div className="icon-box">∮</div>
            <div className="icon-label">闭合积分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\lim_{ }')}>
            <div className="icon-box">→</div>
            <div className="icon-label">极限</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\sin')}>
            <div className="icon-box">sin</div>
            <div className="icon-label">正弦函数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\cos')}>
            <div className="icon-box">cos</div>
            <div className="icon-label">余弦函数</div>
          </div>
            {/* 添加更多数学公式的图标 */}
          </div>
          <div className="formula-row">
          <div className="formula-icon" onClick={() => handleInsertFormula('\\forall')}>
            <div className="icon-box">∀</div>
            <div className="icon-label">全称量词</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\exists')}>
            <div className="icon-box">∃</div>
            <div className="icon-label">存在量词</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\neg')}>
            <div className="icon-box">¬</div>
            <div className="icon-label">非</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\land')}>
            <div className="icon-box">∧</div>
            <div className="icon-label">合取</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\lor')}>
            <div className="icon-box">∨</div>
            <div className="icon-label">析取</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\rightarrow')}>
            <div className="icon-box">→</div>
            <div className="icon-label">蕴含</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\leftrightarrow')}>
            <div className="icon-box">↔</div>
            <div className="icon-label">双向蕴含</div>
          </div>
          {/* 添加更多逻辑运算符的图标 */}
        </div>
        <div className="formula-row">
          {/* ... 其他图标 ... */}
          <div className="formula-icon" onClick={() => handleInsertFormula('=')}>
            <div className="icon-box">=</div>
            <div className="icon-label">等于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\neq')}>
            <div className="icon-box">≠</div>
            <div className="icon-label">不等于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('<')}>
            <div className="icon-box">&lt;</div>
            <div className="icon-label">小于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\leq')}>
            <div className="icon-box">≤</div>
            <div className="icon-label">小于等于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('>')}>
            <div className="icon-box">&gt;</div>
            <div className="icon-label">大于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\geq')}>
            <div className="icon-box">≥</div>
            <div className="icon-label">大于等于</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\approx')}>
            <div className="icon-box">≈</div>
            <div className="icon-label">约等于</div>
          </div>
          {/* 添加更多关系符号的图标 */}
        </div>
        <div className="formula-row">
          {/* ... 其他图标 ... */}
          <div className="formula-icon" onClick={() => handleInsertFormula('\\triangle')}>
            <div className="icon-box">△</div>
            <div className="icon-label">三角形</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\diamond')}>
            <div className="icon-box">◇</div>
            <div className="icon-label">菱形</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\square')}>
            <div className="icon-box">□</div>
            <div className="icon-label">正方形</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\circle')}>
            <div className="icon-box">○</div>
            <div className="icon-label">圆</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\angle')}>
            <div className="icon-box">∠</div>
            <div className="icon-label">角</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\parallel')}>
            <div className="icon-box">∥</div>
            <div className="icon-label">平行</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\perp')}>
            <div className="icon-box">⊥</div>
            <div className="icon-label">垂直</div>
          </div>
          
          <div className="formula-icon" onClick={() => handleInsertFormula('\\vec{ }')}>
            <div className="icon-box">→</div>
            <div className="icon-label">向量</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\hat{ }')}>
            <div className="icon-box">^</div>
            <div className="icon-label">上弧</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\overline{ }')}>
            <div className="icon-box">¯</div>
            <div className="icon-label">上划线</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\underline{ }')}>
            <div className="icon-box">_</div>
            <div className="icon-label">下划线</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\overbrace{ }')}>
            <div className="icon-box">⏞</div>
            <div className="icon-label">上括号</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\underbrace{ }')}>
            <div className="icon-box">⏟</div>
            <div className="icon-label">下括号</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\sum')}>
            <div className="icon-box">∑</div>
            <div className="icon-label">求和</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\prod')}>
            <div className="icon-box">∏</div>
            <div className="icon-label">求积</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\oint')}>
            <div className="icon-box">∮</div>
            <div className="icon-label">闭合的曲线</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\iint')}>
            <div className="icon-box">∬</div>
            <div className="icon-label">双重积分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\iiint')}>
            <div className="icon-box">∭</div>
            <div className="icon-label">三重积分</div>
          </div>
          {/* 添加更多符号的图标 */}
        </div>
        <div className="formula-row">
          {/* ... 其他图标 ... */}
          <div className="formula-icon" onClick={() => handleInsertFormula('\\iiiint')}>
            <div className="icon-box">⨌</div>
            <div className="icon-label">四重积分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\ointclockwise')}>
            <div className="icon-box">∲</div>
            <div className="icon-label">曲面积分</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\cap')}>
            <div className="icon-box">∩</div>
            <div className="icon-label">交集</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\cup')}>
            <div className="icon-box">∪</div>
            <div className="icon-label">并集</div>
          </div>
          {/* 添加更多符号的图标 */}
        </div>
        <div className="formula-row">
          {/* ... 其他图标 ... */}
          <div className="formula-icon" onClick={() => handleInsertFormula('\\frac{2}{4}=0.5')}>
            <div className="icon-box">|</div>
            <div className="icon-label">分数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\tfrac{2}{4} = 0.5')}>
            <div className="icon-box">⎟</div>
            <div className="icon-label">小型分数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\cfrac{2}{c + \\cfrac{2}{d + \\cfrac{2}{4}}} =a')}>
            <div className="icon-box">⎪</div>
            <div className="icon-label">大型分数（嵌套）</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\dfrac{2}{4} = 0.5 \\qquad \\dfrac{2}{c + \\dfrac{2}{d +\\dfrac{2}{4}}} = a')}>
            
            <div className="icon-box">|</div>
            <div className="icon-label">大型分数（不嵌套）</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\dbinom{n}{r}=\\binom{n}{n-r}=C^n_r=C^n_{n-r}')}>
            <div className="icon-box">()</div>
            <div className="icon-label">二项式系数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\tbinom{n}{r}=\\tbinom{n}{n-r}=C^n_r=C^n_{n-r}')}>
          <div className="icon-box">()</div>
            <div className="icon-label">小型二项式系数</div>
          </div>
          <div className="formula-icon" onClick={() => handleInsertFormula('\\binom{n}{r}=\\dbinom{n}{n-r}=C^n_r=C^n_{n-r}')}>
          <div className="icon-box">()</div>
            <div className="icon-label">大型二项式系数</div>
          </div>
          {/* 添加更多符号的图标 */}
        </div>
        </div>
        {/* 编辑器区域 */}
        <textarea
        style={{width: '100%'}}
          value={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
        />
      </div>
     
      <div className="preview">
        {/* 预览区域，用于显示渲染后的数学公式 */}
        <div dangerouslySetInnerHTML={{ __html: katex.renderToString(editorContent, { throwOnError: false }) }} />
      </div>
      <hr />
      <div className="confirm-button-container">
        <Button type="primary" onClick={handleConfirmInsert}>插入数学公式</Button>
      </div>
    </div>
  );
};

export default MathEditor;
