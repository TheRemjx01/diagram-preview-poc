/* eslint-env browser */

// This script runs in the webview context
(function() {
    console.log('Preview script loaded');

    // Add styles for our custom blocks
    const style = document.createElement('style');
    style.textContent = window.customBlockStyles || `
        .diagram-block {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px 0;
            background-color: #f9f9f9;
        }
        
        .diagram-section {
            border: 2px solid #4a9eff;
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
        }
        
        .diagram-section-content {
            font-weight: bold;
            color: #2c5ea5;
        }
    `;
    document.head.appendChild(style);
    // turn off the debug logging
    // Log when custom blocks are found
    // const observer = new MutationObserver((mutations) => {
    //     for (const mutation of mutations) {
    //         const customBlocks = mutation.target.getElementsByClassName('custom-diagram-block');
    //         if (customBlocks.length > 0) {
    //             console.log('Found custom blocks:', customBlocks.length);
    //         }
    //     }
    // });

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // });
})();
