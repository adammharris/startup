/**
 * Utility functions for converting between HTML and Markdown
 */

/**
 * Converts Markdown text to HTML for use in Quill editor
 * @param {string} markdown - Markdown formatted text
 * @returns {string} HTML formatted text
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Handle headings (# Heading)
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Handle bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic (*text*)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Handle underline (_text_) - Note: This is not standard Markdown but a useful addition
  html = html.replace(/\_([^_]+)\_/g, '<u>$1</u>');
  
  // Handle code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Handle inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle blockquotes (> text)
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Handle unordered lists (- item)
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>(\n|$))+/g, '<ul>$&</ul>');
  
  // Handle links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert newlines to <p> tags (handling paragraphs)
  html = html.split(/\n\n+/).map(para => {
    // Don't wrap if already wrapped in a block element
    if (para.match(/^<(h[1-6]|ul|ol|blockquote|pre)/)) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');
  
  // Handle line breaks (single newlines within paragraphs)
  html = html.replace(/([^>\n])\n([^<])/g, '$1<br>$2');
  
  return html;
};

/**
 * Converts HTML text to Markdown format
 * @param {string} html - HTML formatted text
 * @returns {string} Markdown formatted text
 */
export const htmlToMarkdown = (html) => {
  if (!html) return '';
  
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Extract the text content, preserving basic structure
  const extractContent = (element) => {
    let result = '';
    
    // Process all child nodes
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
        // Handle different HTML elements
        if (tagName === 'p') {
          const innerContent = extractContent(node);
          result += innerContent + '\n\n';
        } else if (tagName === 'br') {
          result += '\n';
        } else if (tagName === 'strong' || tagName === 'b') {
          result += `**${extractContent(node)}**`;
        } else if (tagName === 'em' || tagName === 'i') {
          result += `*${extractContent(node)}*`;
        } else if (tagName === 'u') {
          result += `_${extractContent(node)}_`;
        } else if (tagName === 'h1') {
          result += `# ${extractContent(node)}\n\n`;
        } else if (tagName === 'h2') {
          result += `## ${extractContent(node)}\n\n`;
        } else if (tagName === 'h3') {
          result += `### ${extractContent(node)}\n\n`;
        } else if (tagName === 'ul') {
          result += extractContent(node) + '\n';
        } else if (tagName === 'ol') {
          result += extractContent(node) + '\n';
        } else if (tagName === 'li') {
          result += `- ${extractContent(node)}\n`;
        } else if (tagName === 'a') {
          const href = node.getAttribute('href');
          result += `[${extractContent(node)}](${href})`;
        } else if (tagName === 'blockquote') {
          const lines = extractContent(node).split('\n');
          result += lines.map(line => `> ${line}`).join('\n') + '\n\n';
        } else if (tagName === 'code') {
          result += `\`${extractContent(node)}\``;
        } else if (tagName === 'pre') {
          result += `\`\`\`\n${extractContent(node)}\n\`\`\`\n\n`;
        } else {
          // For other elements, just extract their content
          result += extractContent(node);
        }
      }
    });
    
    return result;
  };
  
  let markdown = extractContent(doc.body);
  
  // Clean up extra newlines
  markdown = markdown.replace(/\n\n\n+/g, '\n\n');
  
  return markdown.trim();
};