function showDreeanLogo() {
    const logo = `
       __                         
  ____/ /_______  ___  ____ _____ 
 / __  / ___/ _ \\/ _ \\/ __ \`/ __ \\
/ /_/ / /  /  __/  __/ /_/ / / / /
\\__,_/_/   \\___/\\___/\\__,_/_/ /_/ 
                                  
`;
    
    console.log(logo);
    console.log("Hey you! Wanna see the project of the site? \nCheck it out: https://github.com/AndreaStorci7/andreastorci.it")
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

export { showDreeanLogo, showStyledLogo };