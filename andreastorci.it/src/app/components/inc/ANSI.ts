function showDreamLogo() {
    const logo = `
  __                                           
 /\\ \\                                          
 \\_\\ \\  _ __    __     __       __      ___    
 /'_\` \\/\\\`'__\\/'__\`\\ /'__\`\\   /'__\`\\  /' _ \`\\  
/\\ \\L\\ \\ \\ \\/\\/\\  __/\\/\\ \\L\\.\\_\\/\\ \\L\\.\\_\\/\\ \\/\\ \\ 
\\ \\___,_\\ \\_\\\\ \\____\\ \\__/.\\_\\ \\__/.\\_\\ \\_\\ \\_\\
 \\/__,_ /\\/_/ \\/____/\\/__/\\/_/\\/__/\\/_/\\/_/\\/_/
                                               
                                               
`;
    
    console.log(logo);
}

function showStyledLogo() {
    console.log("%c  __                                           ", "color: #ff6b6b; font-family: monospace; font-weight: bold;");
    console.log("%c /\\ \\                                          ", "color: #4ecdc4; font-family: monospace; font-weight: bold;");
    console.log("%c \\_\\ \\  _ __    __     __       __      ___    ", "color: #45b7d1; font-family: monospace; font-weight: bold;");
    console.log("%c /'_\` \\/\\\`'__\\/'__\`\\ /'__\`\\   /'__\`\\  /' _ \`\\  ", "color: #96ceb4; font-family: monospace; font-weight: bold;");
    console.log("%c/\\ \\L\\ \\ \\ \\/\\/\\  __/\\/\\ \\L\\.\\_\\/\\ \\L\\.\\_\\/\\ \\/\\ \\ ", "color: #ffeaa7; font-family: monospace; font-weight: bold;");
    console.log("%c\\ \\___,_\\ \\_\\\\ \\____\\ \\__/.\\_\\ \\__/.\\_\\ \\_\\ \\_\\", "color: #dda0dd; font-family: monospace; font-weight: bold;");
    console.log("%c \\/__,_ /\\/_/ \\/____/\\/__/\\/_/\\/__/\\/_/\\/_/\\/_/", "color: #98d8c8; font-family: monospace; font-weight: bold;");
    console.log("%c                                               ", "color: #f7dc6f;");
    console.log("%c                                               ", "color: #bb8fce;");
}

export { showDreamLogo, showStyledLogo };