import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

class KaTeXBlock extends React.Component {
  render() {
    const { mathText } = this.props.blockProps;

    console.log("mathText", mathText);
    if (typeof mathText !== 'string') {
      return null;
    }

    const renderMath = () => {
      try {
        const html = katex.renderToString(mathText, {
          throwOnError: false,
          displayMode: false, // Render as inline element
        });
        return { __html: html };
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        return { __html: mathText };
      }
    };

    return <span style={{ display: 'inline-block' }} dangerouslySetInnerHTML={renderMath()} />;
  }
}

export default KaTeXBlock;
