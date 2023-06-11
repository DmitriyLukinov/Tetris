const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var begin_game = document.getElementById('stop_button');
var start = document.querySelector('button');
var scr = document.getElementById('score');
var lvl = document.getElementById('level');
ctx.lineWidth = 2;
var counterTank = 0; // счётчик вращнеий танка
var countertZ = 0;   // счётчик вращений Z
var countertZv = 0;  // счётчик вращений Z-обратного 
var countertG = 0;   // счётчик вращений Г
var countertGv = 0;  // счётчик вращений Г-обратного 
var countertAngle = 0; //счётчик вращений уголка
var countertStick = 0; // счётчик вращений палочки
var counterBigT = 0;   //счётчик вращений большого Т
var counterBigZ = 0;  //счётчик вращений большого Z
var counterBigZv = 0;  //счётчик вращений большого Z-обратного
var fieldArray;
var counterBlock;    // счётчик выпадения блоков
var time = 0;
var start_pause=false;   // счётчик старт/пауза
var score=0;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}
fieldArray = createArray(canvas.width/20,canvas.height/20);

class tTank
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = -20;
        this.x4 = 140;
        this.y4 = 0;
        this.width = 20;
        this.height = 20;   
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetTank()
    {   
        for(var i = counterTank; i<4; i++)
        {
            if (i===0)
            {
                if(fieldArray[this.x2/20][this.y2/20-1]===1) break;
                this.x1 += 20;
                this.y1 -= 20;
                this.x4 -= 20;
                this.y4 -= 20;
                this.x3 -= 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2+20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5-20, this.width-10, this.height-10);              
                counterTank++;               
                break;
            }
            if (i===1)
            {
                if(this.x2===canvas.width-20 || fieldArray[this.x2/20+1][this.y2/20]===1) break;
                this.x1 += 20;
                this.y1 += 20;
                this.x4 += 20;
                this.y4 -= 20;
                this.x3 -= 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2+20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5+20, this.width-10, this.height-10);
                counterTank++;
                break;
            }
            if (i===2)
            {
                if(fieldArray[this.x2/20][this.y2/20+1]===1) break;
                this.x1 -= 20;
                this.y1 += 20;
                this.x4 += 20;
                this.y4 += 20;
                this.x3 += 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2-20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5+20, this.width-10, this.height-10);
                counterTank++;
                break;
            }
            if (i===3)
            {
                if(this.x2===0 || fieldArray[this.x2/20-1][this.y2/20]===1) break;
                this.x1 -= 20;
                this.y1 -= 20;
                this.x4 -= 20;
                this.y4 += 20;
                this.x3 += 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2-20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5-20, this.width-10, this.height-10);
                counterTank = 0;
                break;
            }
        }
    } 
}
class tZ
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = 0;
        this.x4 = 140;
        this.y4 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetZ()
    {
        for(var i = countertZ; i<2; i++)
        {
            if (i===0)
            {
                if (fieldArray[this.x4/20-1][this.y4/20]===1 || fieldArray[this.x2/20][this.y2/20-1]===1 || this.y2===0) break;
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x1+2+20, this.y1+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x1+5+20, this.y1+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-40, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-40, this.y3+5, this.width-10, this.height-10);
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);              
                countertZ++;
                this.x1 += 20;
                this.y1 -= 20;
                this.x4 -= 20;
                this.y4 -= 20;
                this.x3 -= 40;
                this.y3 += 0;
                break;
            }
            if (i===1)
            {               
                if (fieldArray[this.x2/20+1][this.y2/20+1]===1 || fieldArray[this.x2/20][this.y2/20+1]===1) break;
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x1+2, this.y1+2+40, this.width-4, this.height-4);
                ctx.fillRect(this.x1+5, this.y1+5+40, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+40, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+40, this.y3+5, this.width-10, this.height-10);
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
                ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);              
                countertZ=0;
                this.x1 -= 20;
                this.y1 += 20;
                this.x4 += 20;
                this.y4 += 20;
                this.x3 += 40;
                this.y3 -= 0;
                break;
            }
        }
    }
}
class tZv
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 160;
        this.y2 = -20;
        this.x3 = 140;
        this.y3 = 0;
        this.x4 = 120;
        this.y4 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetZv()
    {
        for(var i = countertZv; i<2; i++)
        {
            if (i===0)
            {
                if (fieldArray[this.x1/20-1][this.y1/20]===1 || fieldArray[this.x1/20-1][this.y1/20-1]===1) break;
                this.x1 -= 20;
                this.y1 -= 0;
                this.x2 -= 40;
                this.y2 -= 20;
                this.x4 += 20;
                this.y4 -= 0;
                this.x3 -= 0;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x3+2-20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5, this.width-10, this.height-10);
                countertZv++;
                break;
            }
            if (i===1)
            {
                if (fieldArray[this.x3/20+1][this.y3/20]===1 || fieldArray[this.x3/20-1][this.y3/20+1]===1 || this.x3===canvas.width-20) break;
                this.x1 += 20;
                this.y1 -= 0;
                this.x2 += 40;
                this.y2 += 20;
                this.x4 -= 20;
                this.y4 -= 0;
                this.x3 -= 0;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x1+2-20, this.y1+2, this.width-4, this.height-4);
                ctx.fillRect(this.x1+5-20, this.y1+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x1+2-20, this.y1+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x1+5-20, this.y1+5-20, this.width-10, this.height-10);
                countertZv=0;
                break;
            }
        }
    }
}
class tG
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = -20;
        this.x4 = 160;
        this.y4 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetG()
    {
        for(var i = countertG; i<4; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x2/20][this.y2/20-1]===1 || fieldArray[this.x2/20][this.y2/20+1]===1 || fieldArray[this.x1/20][this.y1/20+1]===1)
                {break;}
                this.x1 += 20;
                this.y1 -= 20;
                this.x4 -= 40;
                this.y4 -= 0;
                this.x3 -= 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x2+2+20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5+20, this.width-10, this.height-10);
                countertG++;
                break;
            }
            if(i===1)
            {
                if(this.x2===canvas.width-20 || fieldArray[this.x2/20+1][this.y2/20]===1 || fieldArray[this.x2/20-1][this.y2/20]===1
                   || fieldArray[this.x2/20-1][this.y2/20-1]===1)
                {break;}
                this.x1 += 20;
                this.y1 += 20;
                this.x4 -= 0;
                this.y4 -= 40;
                this.x3 -= 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5+20, this.width-10, this.height-10);
                countertG++;
                break;
            }
            if(i===2)
            {
                if(this.y2===canvas.height-20 || fieldArray[this.x2/20][this.y2/20-1]===1 || fieldArray[this.x2/20][this.y2/20+1]===1 || fieldArray[this.x2/20+1][this.y2/20-1]===1)
                {break;}
                this.x1 -= 20;
                this.y1 += 20;
                this.x4 += 40;
                this.y4 -= 0;
                this.x3 += 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2-20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5-20, this.width-10, this.height-10);
                countertG++;
                break;
            }
            if(i===3)
            {
                if(this.x2===0 || fieldArray[this.x2/20-1][this.y2/20]===1 || fieldArray[this.x2/20+1][this.y2/20]===1 ||
                   fieldArray[this.x2/20+1][this.y2/20+1]===1)
                {break;}
                this.x1 -= 20;
                this.y1 -= 20;
                this.x4 += 0;
                this.y4 += 40;
                this.x3 += 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5-20, this.width-10, this.height-10);
                countertG=0;
                break;
            }
        }
    }
}
class tGv
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = -20;
        this.x4 = 120;
        this.y4 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetGv()
    {
        for(var i = countertGv; i<4; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x2/20][this.y2/20-1]===1 || fieldArray[this.x2/20][this.y2/20+1]===1 || fieldArray[this.x2/20-1][this.y2/20-1]===1)
                {break;}
                this.x1 += 20;
                this.y1 -= 20;
                this.x4 -= 0;
                this.y4 -= 40;
                this.x3 -= 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x2+2+20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5+20, this.width-10, this.height-10);
                countertGv++;
                break;
            }
            if(i===1)
            {
                if(this.x2===canvas.width-20 || fieldArray[this.x2/20+1][this.y2/20]===1 || fieldArray[this.x2/20-1][this.y2/20]===1
                   || fieldArray[this.x2/20+1][this.y2/20-1]===1)
                {break;}
                this.x1 += 20;
                this.y1 += 20;
                this.x4 += 40;
                this.y4 -= 0;
                this.x3 -= 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2-20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5-20, this.width-10, this.height-10);
                countertGv++;
                break;
            }
            if(i===2)
            {
                if(this.y2===canvas.height-20 || fieldArray[this.x2/20][this.y2/20-1]===1 || fieldArray[this.x2/20][this.y2/20+1]===1 || fieldArray[this.x2/20+1][this.y2/20+1]===1)
                {break;}
                this.x1 -= 20;
                this.y1 += 20;
                this.x4 += 0;
                this.y4 += 40;
                this.x3 += 20;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2-20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5-20, this.width-10, this.height-10);
                countertGv++;
                break;
            }
            if(i===3)
            {
                if(this.x2===0 || fieldArray[this.x2/20-1][this.y2/20]===1 || fieldArray[this.x2/20+1][this.y2/20]===1 ||
                   fieldArray[this.x2/20-1][this.y2/20+1]===1)
                {break;}
                this.x1 -= 20;
                this.y1 -= 20;
                this.x4 -= 40;
                this.y4 += 0;
                this.x3 += 20;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, this.y2+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x2+2+20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5+20, this.width-10, this.height-10);
                countertGv=0;
                break;
            }
        }
    }
}
class tAngle
{
    constructor(x1, y1, x2, y2, x3, y3, width, height)
    {
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 160;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    } 
    rotatetAngle()
    {
        for(var i = countertAngle; i<4; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x1/20][this.y1/20+1]===1) break;
                this.x1 += 20;
                this.y1 -= 0;
                this.x2 += 0;
                this.y2 += 20;
                this.x3 -= 20;
                this.y3 -= 0;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2-20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5-20, this.width-10, this.height-10);
                countertAngle++;
                break;
            }
            if(i===1)
            {
                if(fieldArray[this.x1/20-1][this.y1/20]===1) break;
                this.x1 += 0;
                this.y1 += 20;
                this.x2 -= 20;
                this.y2 += 0;
                this.x3 -= 0;
                this.y3 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2+20, this.y2+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5-20, this.width-10, this.height-10);
                countertAngle++;
                break;
            }
            if(i===2)
            {
                if(fieldArray[this.x1/20][this.y1/20-1]===1) break;
                this.x1 -= 20;
                this.y1 += 0;
                this.x2 -= 0;
                this.y2 -= 20;
                this.x3 += 20;
                this.y3 -= 0;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2+20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5+20, this.y2+5+20, this.width-10, this.height-10);
                countertAngle++;
                break;
            }
            if(i===3)
            {
                if(fieldArray[this.x1/20+1][this.y1/20]===1) break;
                this.x1 -= 0;
                this.y1 -= 20;
                this.x2 += 20;
                this.y2 -= 0;
                this.x3 += 0;
                this.y3 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2-20, this.y2+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5-20, this.y2+5+20, this.width-10, this.height-10);
                countertAngle=0;
                break;
            }
        }
    }
}
class tSquare extends tG
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, x4, y4, width, height);
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 160;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = 0;
        this.x4 = 140;
        this.y4 = 0;
    }
}
class tStick extends tG
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, x4, y4, width, height);
        this.x1 = 100;
        this.y1 = -20;
        this.x2 = 120;
        this.y2 = -20;
        this.x3 = 140;
        this.y3 = -20;
        this.x4 = 160;
        this.y4 = -20;
    }
    rotatetStick()
    {
        for(var i = countertStick; i<2; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x3/20][this.y3/20+1]===1 || fieldArray[this.x3/20][this.y3/20-1]===1 || fieldArray[this.x3/20][this.y3/20-2]===1
                   || stick.y4===canvas.height-20)
                {break;}
                this.x1 += 40;
                this.y1 -= 40;
                this.x2 += 20;
                this.y2 -= 20;
                this.x4 -= 20;
                this.y4 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2+20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-40, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-40, this.y3+5, this.width-10, this.height-10);
                countertStick++;
                break;
            }
            if(i===1)
            {
                if(fieldArray[this.x3/20+1][this.y3/20]===1 || fieldArray[this.x3/20-1][this.y3/20]===1 || fieldArray[this.x3/20-2][this.y3/20]===1)
                {break;}
                this.x1 -= 40;
                this.y1 += 40;
                this.x2 -= 20;
                this.y2 += 20;
                this.x4 += 20;
                this.y4 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2-40, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5-40, this.width-10, this.height-10);
                countertStick=0;
                break;
            }
        }
    }
}
class tBigT
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
    {
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 160;
        this.y3 = -20;
        this.x4 = 140;
        this.y4 = 0;
        this.x5 = 140;
        this.y5 = 20;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x5+2, this.y5+2, this.width-4, this.height-4);
        ctx.fillRect(this.x5+5, this.y5+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;
        this.y4 += 20;
        this.y5 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x4+2, this.y4+2, this.width-4, this.height-4);
        ctx.fillRect(this.x4+5, this.y4+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x5+2, this.y5+2, this.width-4, this.height-4);
        ctx.fillRect(this.x5+5, this.y5+5, this.width-10, this.height-10);
    }
    controlRemoveRow()
    {
        for(var j = 0; j<canvas.height/20; j++)
        {
            if(fieldArray[0][j]===1 && fieldArray[1][j]===1 && fieldArray[2][j]===1 && fieldArray[3][j]===1 && fieldArray[4][j]===1 &&
               fieldArray[5][j]===1 && fieldArray[6][j]===1 && fieldArray[7][j]===1 && fieldArray[8][j]===1 && fieldArray[9][j]===1 &&
               fieldArray[10][j]===1 && fieldArray[11][j]===1 && fieldArray[12][j]===1 && fieldArray[13][j]===1 && fieldArray[14][j]===1)
            {
                score++;
                scr.textContent = `Score: ${score}`;
                for(var i = 0; i<canvas.width/20; i++)
                {
                    fieldArray[i][j]=0;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.strokeRect(i*20+2, j*20+2, this.width-4, this.height-4);
                    ctx.fillRect(i*20+5, j*20+5, this.width-10, this.height-10);
                }
                for(var k = j-1; k>=0; k--)
                {
                    for(var m = 0; m<canvas.width/20; m++)
                    {
                        if(fieldArray[m][k]===1)
                        {
                            fieldArray[m][k+1]=1;
                            fieldArray[m][k]=null;
                            ctx.fillStyle = 'black';
                            ctx.strokeStyle = 'black';
                            ctx.strokeRect(m*20+2, (k+1)*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, (k+1)*20+5, this.width-10, this.height-10);
                            ctx.fillStyle = 'white';
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(m*20+2, k*20+2, this.width-4, this.height-4);
                            ctx.fillRect(m*20+5, k*20+5, this.width-10, this.height-10);
                        }
                    }
                }
            }
        }
    }
    rotatetBigT()
    {
        for(var i = counterBigT; i<4; i++)
        {
            if (i===0)
            {
                if(fieldArray[this.x4/20-1][this.y4/20]===1 || fieldArray[this.x4/20+1][this.y4/20]===1 || fieldArray[this.x4/20+1][this.y4/20+1]===1)
                {break;}
                this.x1 += 40;
                this.y1 -= 0;
                this.x2 += 20;
                this.y2 += 20;
                this.x3 -= 0;
                this.y3 += 40;
                this.x5 -= 20;
                this.y5 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x4+2-20, this.y4+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5-20, this.y4+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x4+2, this.y4+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5, this.y4+5-20, this.width-10, this.height-10); 
                ctx.strokeRect(this.x4+2, this.y4+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5, this.y4+5+20, this.width-10, this.height-10);             
                counterBigT++;               
                break;
            }
            if (i===1)
            {
                if(fieldArray[this.x4/20][this.y4/20-1]===1 || fieldArray[this.x4/20][this.y4/20+1]===1 || fieldArray[this.x4/20-1][this.y4/20+1]===1)
                {break;}
                this.x1 += 0;
                this.y1 += 40;
                this.x2 -= 20;
                this.y2 += 20;
                this.x3 -= 40;
                this.y3 += 0;
                this.x5 += 20;
                this.y5 -= 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x4+2-20, this.y4+2, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5-20, this.y4+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x4+2+20, this.y4+2, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5+20, this.y4+5, this.width-10, this.height-10); 
                ctx.strokeRect(this.x4+2+20, this.y4+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5+20, this.y4+5-20, this.width-10, this.height-10);             
                counterBigT++;               
                break;
            }
            if (i===2)
            {
                if(fieldArray[this.x4/20-1][this.y4/20]===1 || fieldArray[this.x4/20+1][this.y4/20]===1 || fieldArray[this.x4/20-1][this.y4/20-1]===1)
                {break;}
                this.x1 -= 40;
                this.y1 -= 0;
                this.x2 -= 20;
                this.y2 -= 20;
                this.x3 -= 0;
                this.y3 -= 40;
                this.x5 += 20;
                this.y5 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x4+2+20, this.y4+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5+20, this.y4+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x4+2, this.y4+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5, this.y4+5-20, this.width-10, this.height-10); 
                ctx.strokeRect(this.x4+2, this.y4+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5, this.y4+5+20, this.width-10, this.height-10);             
                counterBigT++;               
                break;
            }
            if (i===3)
            {
                if(fieldArray[this.x4/20][this.y4/20-1]===1 || fieldArray[this.x4/20][this.y4/20+1]===1 || fieldArray[this.x4/20+1][this.y4/20-1]===1)
                {break;}
                this.x1 += 0;
                this.y1 -= 40;
                this.x2 += 20;
                this.y2 -= 20;
                this.x3 += 40;
                this.y3 -= 0;
                this.x5 -= 20;
                this.y5 += 20;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x4+2-20, this.y4+2, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5-20, this.y4+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x4+2+20, this.y4+2, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5+20, this.y4+5, this.width-10, this.height-10); 
                ctx.strokeRect(this.x4+2-20, this.y4+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x4+5-20, this.y4+5+20, this.width-10, this.height-10);             
                counterBigT=0;               
                break;
            }
        }
    }
}
class tBigZ extends tBigT
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
        this.x1 = 120;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 140;
        this.y3 = 0;
        this.x4 = 140;
        this.y4 = 20;
        this.x5 = 160;
        this.y5 = 20;
    }
    rotatetBigZ()
    {
        for(var i = counterBigZ; i<2; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x3/20-1][this.y3/20]===1 || fieldArray[this.x3/20+1][this.y3/20]===1 
                   || fieldArray[this.x3/20-1][this.y3/20+1]===1 || fieldArray[this.x3/20+1][this.y3/20-1]===1)
                {break;}
                this.x1 += 0;
                this.y1 += 40;
                this.x2 -= 20;
                this.y2 += 20;
                this.x4 += 20;
                this.y4 -= 20;
                this.x5 -= 0;
                this.y5 -= 40;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2-20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5-20, this.width-10, this.height-10);            
                counterBigZ++;               
                break;
            }
            if(i===1)
            {
                if(fieldArray[this.x3/20][this.y3/20-1]===1 || fieldArray[this.x3/20][this.y3/20+1]===1 
                   || fieldArray[this.x3/20-1][this.y3/20-1]===1 || fieldArray[this.x3/20+1][this.y3/20+1]===1)
                {break;}
                this.x1 += 0;
                this.y1 -= 40;
                this.x2 += 20;
                this.y2 -= 20;
                this.x4 -= 20;
                this.y4 += 20;
                this.x5 -= 0;
                this.y5 += 40;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2-20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5, this.width-10, this.height-10);            
                counterBigZ=0;               
                break;
            }
        }
    }
}
class tBigZv extends tBigT
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
        this.x1 = 160;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = -20;
        this.x3 = 140;
        this.y3 = 0;
        this.x4 = 140;
        this.y4 = 20;
        this.x5 = 120;
        this.y5 = 20;
    }
    rotatetBigZv()
    {
        for(var i = counterBigZv; i<2; i++)
        {
            if(i===0)
            {
                if(fieldArray[this.x3/20-1][this.y3/20]===1 || fieldArray[this.x3/20+1][this.y3/20]===1 
                   || fieldArray[this.x3/20-1][this.y3/20-1]===1 || fieldArray[this.x3/20+1][this.y3/20+1]===1)
                {break;}
                this.x1 += 0;
                this.y1 += 40;
                this.x2 += 20;
                this.y2 += 20;
                this.x4 -= 20;
                this.y4 -= 20;
                this.x5 -= 0;
                this.y5 -= 40;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2+20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, this.y3+5-20, this.width-10, this.height-10);            
                counterBigZv++;               
                break;
            }
            if(i===1)
            {
                if(fieldArray[this.x3/20][this.y3/20-1]===1 || fieldArray[this.x3/20][this.y3/20+1]===1 
                   || fieldArray[this.x3/20+1][this.y3/20-1]===1 || fieldArray[this.x3/20-1][this.y3/20+1]===1)
                {break;}
                this.x1 += 0;
                this.y1 -= 40;
                this.x2 -= 20;
                this.y2 -= 20;
                this.x4 += 20;
                this.y4 += 20;
                this.x5 -= 0;
                this.y5 += 40;
                this.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white'; 
                ctx.strokeRect(this.x3+2-20, this.y3+2-20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5-20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2+20, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5+20, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2+20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5+20, this.y3+5, this.width-10, this.height-10);
                ctx.strokeRect(this.x3+2-20, this.y3+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5-20, this.y3+5, this.width-10, this.height-10);            
                counterBigZv=0;               
                break;
            }
        }
    }
}
class tCross extends tBigT
{
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, width, height)
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 120;
        this.y2 = 0;
        this.x3 = 140;
        this.y3 = 0;
        this.x4 = 160;
        this.y4 = 0;
        this.x5 = 140;
        this.y5 = 20;
    }
}
class tTwo
{
    constructor(x1, y1, x2, y2, width, height)
    {
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = 0;
        this.width = 20;
        this.height = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;

        this.setBlock();
    }
    clear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);
    }
    tcrash()
    {
        for(var i=this.y2/20+1; i<canvas.height/20; i++)
        {
            if(fieldArray[this.x2/20][i]===1)
            {
                fieldArray[this.x2/20][i]=0;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x2+2, i*20+2, this.width-4, this.height-4);
                ctx.fillRect(this.x2+5, i*20+5, this.width-10, this.height-10);
                break;
            }
        }
    }
}
class tThree extends tAngle
{
    constructor(x1, y1, x2, y2, x3, y3, width, height)
    {
        super(x1, y1, x2, y2, x3, y3, width, height)
        this.x1 = 140;
        this.y1 = -20;
        this.x2 = 140;
        this.y2 = 0;
        this.x3 = 140;
        this.y3 = 20;
    }
    setBlock()
    {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';

        ctx.strokeRect(this.x1+2, this.y1+2, this.width-4, this.height-4);
        ctx.fillRect(this.x1+5, this.y1+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x2+2, this.y2+2, this.width-4, this.height-4);
        ctx.fillRect(this.x2+5, this.y2+5, this.width-10, this.height-10);

        ctx.strokeRect(this.x3+2, this.y3+2, this.width-4, this.height-4);
        ctx.fillRect(this.x3+5, this.y3+5, this.width-10, this.height-10);
    }
    fall()
    {
        this.y1 += 20;
        this.y2 += 20;
        this.y3 += 20;

        this.setBlock();
    }
    tfill()
    {
        for(var i=this.y3/20+1; i<canvas.height/20; i++)
        {
            if(fieldArray[this.x2/20][i]===1)
            {
                if(i-this.y3/20===1) break;
                fieldArray[this.x2/20][i-1]=1;
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x3+2, (i-1)*20+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, (i-1)*20+5, this.width-10, this.height-10);
                this.controlRemoveRow();
                break;
            }
            if(i===canvas.height/20-1)
            {
                fieldArray[this.x2/20][i]=1;
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x3+2, i*20+2, this.width-4, this.height-4);
                ctx.fillRect(this.x3+5, i*20+5, this.width-10, this.height-10);
                this.controlRemoveRow();
                break;
            }
        }
    }
}
class Bullet
{
    constructor(x, y, width, height)
    {
        this.x=x;
        this.y=y;
        this.width=20;
        this.height=20;
    }
    setBullet()
    {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x+2, this.y+2, this.width-4, this.height-4);
        ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
    }
    bulletFly()
    {
        this.bulletClear();
        this.y += 3;
        this.setBullet();        
    }
    bulletClear()
    {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(this.x+2, this.y+2, this.width-4, this.height-4);
        ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
    }
}

var tank = new tTank;
var tz = new tZ;
var tg = new tG;
var tgv = new tGv;
var tzv = new tZv;
var angle = new tAngle;
var square = new tSquare;
var stick = new tStick;
var bigT = new tBigT;
var bigZ = new tBigZ;
var bigZv = new tBigZv;
var cross = new tCross;
var two = new tTwo;
var three = new tThree;

function fall1()
{ 
    start.removeEventListener('click',fall1);
    start.addEventListener('click', gap);
    function fall()
    {  
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetTank);
            window.removeEventListener('keydown', rotate);
            clearTimeout(fall,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall1);
        }
        else
        {
            time = 500;
            if(tank.y1!==canvas.height-20 && tank.y2!==canvas.height-20 && tank.y3!==canvas.height-20 && tank.y4!==canvas.height-20 &&
                fieldArray[tank.x1/20][tank.y1/20+1]!==1 && fieldArray[tank.x2/20][tank.y2/20+1]!==1 &&
                fieldArray[tank.x3/20][tank.y3/20+1]!==1 && fieldArray[tank.x4/20][tank.y4/20+1]!==1
            )
            {
                tank.clear();
                tank.fall();
                window.addEventListener('keydown', rotate);
                window.addEventListener('keydown', movetTank);
                fall1();               
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotate);
                window.removeEventListener('keydown', movetTank);
                fieldArray[tank.x1/20][tank.y1/20]=1;
                fieldArray[tank.x2/20][tank.y2/20]=1;
                fieldArray[tank.x3/20][tank.y3/20]=1;
                fieldArray[tank.x4/20][tank.y4/20]=1;
                tank.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    tank.x1 = 120;
                    tank.y1 = -20;
                    tank.x2 = 140;
                    tank.y2 = -20;
                    tank.x3 = 160;
                    tank.y3 = -20;
                    tank.x4 = 140;
                    tank.y4 = 0;
                    counterTank = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall,time);
}
function fall2()
{
    start.removeEventListener('click',fall2);
    start.addEventListener('click', gap);
    function fall21()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetZ);
            window.removeEventListener('keydown', rotatetZ);
            clearTimeout(fall21,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall2);
        }
        else
        {
            time = 500;
            if(tz.y1!==canvas.height-20 && tz.y2!==canvas.height-20 && tz.y3!==canvas.height-20 && tz.y4!==canvas.height-20 &&
                fieldArray[tz.x1/20][tz.y1/20+1]!==1 && fieldArray[tz.x2/20][tz.y2/20+1]!==1 &&
                fieldArray[tz.x3/20][tz.y3/20+1]!==1 && fieldArray[tz.x4/20][tz.y4/20+1]!==1
            )
            {
                tz.clear();
                tz.fall();
                window.addEventListener('keydown', rotatetZ);
                window.addEventListener('keydown', movetZ);
                fall2();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetZ);
                window.removeEventListener('keydown', movetZ);
                fieldArray[tz.x1/20][tz.y1/20]=1;
                fieldArray[tz.x2/20][tz.y2/20]=1;
                fieldArray[tz.x3/20][tz.y3/20]=1;
                fieldArray[tz.x4/20][tz.y4/20]=1;
                tz.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    tz.x1 = 120;
                    tz.y1 = -20;
                    tz.x2 = 140;
                    tz.y2 = -20;
                    tz.x3 = 160;
                    tz.y3 = 0;
                    tz.x4 = 140;
                    tz.y4 = 0;
                    countertZ = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall21,time);
}
function fall3()
{
    start.removeEventListener('click',fall3);
    start.addEventListener('click', gap);
    function fall31()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetG);
            window.removeEventListener('keydown', rotatetG);
            clearTimeout(fall31,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall3);
        }
        else
        {
            time = 500;
            if(tg.y1!==canvas.height-20 && tg.y2!==canvas.height-20 && tg.y3!==canvas.height-20 && tg.y4!==canvas.height-20 &&
                fieldArray[tg.x1/20][tg.y1/20+1]!==1 && fieldArray[tg.x2/20][tg.y2/20+1]!==1 &&
                fieldArray[tg.x3/20][tg.y3/20+1]!==1 && fieldArray[tg.x4/20][tg.y4/20+1]!==1
            )
            {
                tg.clear();
                tg.fall();
                window.addEventListener('keydown', rotatetG);
                window.addEventListener('keydown', movetG);
                fall3();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetG);
                window.removeEventListener('keydown', movetG);
                fieldArray[tg.x1/20][tg.y1/20]=1;
                fieldArray[tg.x2/20][tg.y2/20]=1;
                fieldArray[tg.x3/20][tg.y3/20]=1;
                fieldArray[tg.x4/20][tg.y4/20]=1;
                tg.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    tg.x1 = 120;
                    tg.y1 = -20;
                    tg.x2 = 140;
                    tg.y2 = -20;
                    tg.x3 = 160;
                    tg.y3 = -20;
                    tg.x4 = 160;
                    tg.y4 = 0;
                    countertG = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall31,time);
}
function fall4()
{
    start.removeEventListener('click',fall4);
    start.addEventListener('click', gap);
    function fall41()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetGv);
            window.removeEventListener('keydown', rotatetGv);
            clearTimeout(fall41,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall4);
        }
        else
        {
            time = 500;
            if(tgv.y1!==canvas.height-20 && tgv.y2!==canvas.height-20 && tgv.y3!==canvas.height-20 && tgv.y4!==canvas.height-20 &&
                fieldArray[tgv.x1/20][tgv.y1/20+1]!==1 && fieldArray[tgv.x2/20][tgv.y2/20+1]!==1 &&
                fieldArray[tgv.x3/20][tgv.y3/20+1]!==1 && fieldArray[tgv.x4/20][tgv.y4/20+1]!==1
            )
            {
                tgv.clear();
                tgv.fall();
                window.addEventListener('keydown', rotatetGv);
                window.addEventListener('keydown', movetGv);
                fall4();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetGv);
                window.removeEventListener('keydown', movetGv);
                fieldArray[tgv.x1/20][tgv.y1/20]=1;
                fieldArray[tgv.x2/20][tgv.y2/20]=1;
                fieldArray[tgv.x3/20][tgv.y3/20]=1;
                fieldArray[tgv.x4/20][tgv.y4/20]=1;
                tgv.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    tgv.x1 = 120;
                    tgv.y1 = -20;
                    tgv.x2 = 140;
                    tgv.y2 = -20;
                    tgv.x3 = 160;
                    tgv.y3 = -20;
                    tgv.x4 = 120;
                    tgv.y4 = 0;
                    countertGv = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall41,time);
}
function fall5()
{
    start.removeEventListener('click',fall5);
    start.addEventListener('click', gap);
    function fall51()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetZv);
            window.removeEventListener('keydown', rotatetZv);
            clearTimeout(fall51,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall5);
        }
        else
        {
            time = 500;
            if(tzv.y1!==canvas.height-20 && tzv.y2!==canvas.height-20 && tzv.y3!==canvas.height-20 && tzv.y4!==canvas.height-20 &&
                fieldArray[tzv.x1/20][tzv.y1/20+1]!==1 && fieldArray[tzv.x2/20][tzv.y2/20+1]!==1 &&
                fieldArray[tzv.x3/20][tzv.y3/20+1]!==1 && fieldArray[tzv.x4/20][tzv.y4/20+1]!==1
            )
            {
                tzv.clear();
                tzv.fall();
                window.addEventListener('keydown', rotatetZv);
                window.addEventListener('keydown', movetZv);
                fall5();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetZv);
                window.removeEventListener('keydown', movetZv);
                fieldArray[tzv.x1/20][tzv.y1/20]=1;
                fieldArray[tzv.x2/20][tzv.y2/20]=1;
                fieldArray[tzv.x3/20][tzv.y3/20]=1;
                fieldArray[tzv.x4/20][tzv.y4/20]=1;
                tzv.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    tzv.x1 = 140;
                    tzv.y1 = -20;
                    tzv.x2 = 160;
                    tzv.y2 = -20;
                    tzv.x3 = 140;
                    tzv.y3 = 0;
                    tzv.x4 = 120;
                    tzv.y4 = 0;
                    countertZv = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall51, time);
}
function fall6()
{
    start.removeEventListener('click',fall6);
    start.addEventListener('click', gap);
    function fall61()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetAngle);
            window.removeEventListener('keydown', rotatetAngle);
            clearTimeout(fall61,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall6);
        }
        else
        {
            time = 500;
            if(angle.y1!==canvas.height-20 && angle.y2!==canvas.height-20 && angle.y3!==canvas.height-20 &&
                fieldArray[angle.x1/20][angle.y1/20+1]!==1 && fieldArray[angle.x2/20][angle.y2/20+1]!==1 && fieldArray[angle.x3/20][angle.y3/20+1]!==1)
            {
                angle.clear();
                angle.fall();
                window.addEventListener('keydown', rotatetAngle);
                window.addEventListener('keydown', movetAngle);
                fall6();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetAngle);
                window.removeEventListener('keydown', movetAngle);
                fieldArray[angle.x1/20][angle.y1/20]=1;
                fieldArray[angle.x2/20][angle.y2/20]=1;
                fieldArray[angle.x3/20][angle.y3/20]=1;
                angle.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    angle.x1 = 140;
                    angle.y1 = -20;
                    angle.x2 = 160;
                    angle.y2 = -20;
                    angle.x3 = 160;
                    angle.y3 = 0;
                    countertAngle = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall61, time);
}
function fall7()
{
    start.removeEventListener('click',fall7);
    start.addEventListener('click', gap);
    function fall71()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetSquare);
            clearTimeout(fall71,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall7);
        }
        else
        {
            time = 500;
            if(square.y3!==canvas.height-20 && square.y4!==canvas.height-20 &&
                fieldArray[square.x3/20][square.y3/20+1]!==1 && fieldArray[square.x4/20][square.y4/20+1]!==1)
            {
                square.clear();
                square.fall();
                window.addEventListener('keydown', movetSquare);
                fall7();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', movetSquare);
                fieldArray[square.x1/20][square.y1/20]=1;
                fieldArray[square.x2/20][square.y2/20]=1;
                fieldArray[square.x3/20][square.y3/20]=1;
                fieldArray[square.x4/20][square.y4/20]=1;
                square.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    square.x1 = 140;
                    square.y1 = -20;
                    square.x2 = 160;
                    square.y2 = -20;
                    square.x3 = 160;
                    square.y3 = 0;
                    square.x4 = 140;
                    square.y4 = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall71,time);
}
function fall8()
{
    start.removeEventListener('click',fall8);
    start.addEventListener('click', gap);
    function fall81()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetStick);
            window.removeEventListener('keydown', rotatetStick);
            clearTimeout(fall81,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall8);
        }
        else
        {
            time = 500;
            if(stick.y1!==canvas.height-20 && stick.y2!==canvas.height-20 && stick.y3!==canvas.height-20 && stick.y4!==canvas.height-20 &&
                fieldArray[stick.x1/20][stick.y1/20+1]!==1 && fieldArray[stick.x2/20][stick.y2/20+1]!==1 &&
                fieldArray[stick.x3/20][stick.y3/20+1]!==1 && fieldArray[stick.x4/20][stick.y4/20+1]!==1)
            {
                stick.clear();
                stick.fall();
                window.addEventListener('keydown', rotatetStick);
                window.addEventListener('keydown', movetStick);
                fall8();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetStick);
                window.removeEventListener('keydown', movetStick);
                fieldArray[stick.x1/20][stick.y1/20]=1;
                fieldArray[stick.x2/20][stick.y2/20]=1;
                fieldArray[stick.x3/20][stick.y3/20]=1;
                fieldArray[stick.x4/20][stick.y4/20]=1;
                stick.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[5][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    stick.x1 = 100;
                    stick.y1 = -20;
                    stick.x2 = 120;
                    stick.y2 = -20;
                    stick.x3 = 140;
                    stick.y3 = -20;
                    stick.x4 = 160;
                    stick.y4 = -20;
                    countertStick = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall81,time);
}
function fall9()
{
    start.removeEventListener('click',fall9);
    start.addEventListener('click', gap);
    function fall91()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetBigT);
            window.removeEventListener('keydown', rotatetBigT);
            clearTimeout(fall91,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall9);
        }
        else
        {
            time = 500;
            if(bigT.y1!==canvas.height-20 && bigT.y2!==canvas.height-20 && bigT.y3!==canvas.height-20 && bigT.y4!==canvas.height-20 &&
                bigT.y5!==canvas.height-20  && fieldArray[bigT.x1/20][bigT.y1/20+1]!==1 && fieldArray[bigT.x2/20][bigT.y2/20+1]!==1 &&
                fieldArray[bigT.x3/20][bigT.y3/20+1]!==1 && fieldArray[bigT.x4/20][bigT.y4/20+1]!==1 && fieldArray[bigT.x5/20][bigT.y5/20+1]!==1)
            {
                bigT.clear();
                bigT.fall();
                window.addEventListener('keydown', rotatetBigT);
                window.addEventListener('keydown', movetBigT);
                fall9();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetBigT);
                window.removeEventListener('keydown', movetBigT);
                fieldArray[bigT.x1/20][bigT.y1/20]=1;
                fieldArray[bigT.x2/20][bigT.y2/20]=1;
                fieldArray[bigT.x3/20][bigT.y3/20]=1;
                fieldArray[bigT.x4/20][bigT.y4/20]=1;
                fieldArray[bigT.x5/20][bigT.y5/20]=1;
                bigT.controlRemoveRow();
                if(fieldArray[7][1]===1 || fieldArray[6][1]===1 || fieldArray[8][1]===1 || 
                    fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    bigT.x1 = 120;
                    bigT.y1 = -20;
                    bigT.x2 = 140;
                    bigT.y2 = -20;
                    bigT.x3 = 160;
                    bigT.y3 = -20;
                    bigT.x4 = 140;
                    bigT.y4 = 0;
                    bigT.x5 = 140;
                    bigT.y5 = 20;
                    counterBigT = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall91, time);
}
function fall10()
{
    start.removeEventListener('click',fall10);
    start.addEventListener('click', gap);
    function fall101()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetBigZ);
            window.removeEventListener('keydown', rotatetBigZ);
            clearTimeout(fall101,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall10);
        }
        else
        {
            time = 500;
            if(bigZ.y1!==canvas.height-20 && bigZ.y2!==canvas.height-20 && bigZ.y4!==canvas.height-20 && bigZ.y5!==canvas.height-20  
                && fieldArray[bigZ.x1/20][bigZ.y1/20+1]!==1 && fieldArray[bigZ.x2/20][bigZ.y2/20+1]!==1 &&
                fieldArray[bigZ.x3/20][bigZ.y3/20+1]!==1 && fieldArray[bigZ.x4/20][bigZ.y4/20+1]!==1 && fieldArray[bigZ.x5/20][bigZ.y5/20+1]!==1)
            {
                bigZ.clear();
                bigZ.fall();
                window.addEventListener('keydown', rotatetBigZ);
                window.addEventListener('keydown', movetBigZ);
                fall10();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetBigZ);
                window.removeEventListener('keydown', movetBigZ);
                fieldArray[bigZ.x1/20][bigZ.y1/20]=1;
                fieldArray[bigZ.x2/20][bigZ.y2/20]=1;
                fieldArray[bigZ.x3/20][bigZ.y3/20]=1;
                fieldArray[bigZ.x4/20][bigZ.y4/20]=1;
                fieldArray[bigZ.x5/20][bigZ.y5/20]=1;
                bigZ.controlRemoveRow();
                if(fieldArray[7][1]===1 || fieldArray[8][1]===1 || 
                    fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    bigZ.x1 = 120;
                    bigZ.y1 = -20;
                    bigZ.x2 = 140;
                    bigZ.y2 = -20;
                    bigZ.x3 = 140;
                    bigZ.y3 = 0;
                    bigZ.x4 = 140;
                    bigZ.y4 = 20;
                    bigZ.x5 = 160;
                    bigZ.y5 = 20;
                    counterBigZ = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall101, time);
}
function fall11()
{
    start.removeEventListener('click',fall11);
    start.addEventListener('click', gap);
    function fall111()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetBigZv);
            window.removeEventListener('keydown', rotatetBigZv);
            clearTimeout(fall111,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall11);
        }
        else
        {
            time = 500;
            if(bigZv.y1!==canvas.height-20 && bigZv.y2!==canvas.height-20 && bigZv.y4!==canvas.height-20 && bigZv.y5!==canvas.height-20  
                && fieldArray[bigZv.x1/20][bigZv.y1/20+1]!==1 && fieldArray[bigZv.x2/20][bigZv.y2/20+1]!==1 &&
                fieldArray[bigZv.x3/20][bigZv.y3/20+1]!==1 && fieldArray[bigZv.x4/20][bigZv.y4/20+1]!==1 && fieldArray[bigZv.x5/20][bigZv.y5/20+1]!==1)
            {
                bigZv.clear();
                bigZv.fall();
                window.addEventListener('keydown', rotatetBigZv);
                window.addEventListener('keydown', movetBigZv);
                fall11();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', rotatetBigZv);
                window.removeEventListener('keydown', movetBigZv);
                fieldArray[bigZv.x1/20][bigZv.y1/20]=1;
                fieldArray[bigZv.x2/20][bigZv.y2/20]=1;
                fieldArray[bigZv.x3/20][bigZv.y3/20]=1;
                fieldArray[bigZv.x4/20][bigZv.y4/20]=1;
                fieldArray[bigZv.x5/20][bigZv.y5/20]=1;
                bigZv.controlRemoveRow();
                if(fieldArray[7][1]===1 || fieldArray[6][1]===1 ||  
                    fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1) pizdets();
                else
                {
                    bigZv.x1 = 160;
                    bigZv.y1 = -20;
                    bigZv.x2 = 140;
                    bigZv.y2 = -20;
                    bigZv.x3 = 140;
                    bigZv.y3 = 0;
                    bigZv.x4 = 140;
                    bigZv.y4 = 20;
                    bigZv.x5 = 120;
                    bigZv.y5 = 20;
                    counterBigZv = 0;
                    go();
                }
            }
        }
    }
    setTimeout(fall111, time);
}
function fall12()
{
    start.removeEventListener('click',fall12);
    start.addEventListener('click', gap);
    function fall121()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', movetCross);
            clearTimeout(fall121,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall12);
        }
        else
        {
            time = 500;
            if(cross.y5!==canvas.height-20 &&
                fieldArray[cross.x2/20][cross.y2/20+1]!==1 &&
                fieldArray[cross.x5/20][cross.y5/20+1]!==1 && fieldArray[cross.x4/20][cross.y4/20+1]!==1)
            {
                cross.clear();
                cross.fall();
                window.addEventListener('keydown', movetCross);
                fall12();
            }
            else
            {
                time = 0;
                window.removeEventListener('keydown', movetCross);
                fieldArray[cross.x1/20][cross.y1/20]=1;
                fieldArray[cross.x2/20][cross.y2/20]=1;
                fieldArray[cross.x3/20][cross.y3/20]=1;
                fieldArray[cross.x4/20][cross.y4/20]=1;
                fieldArray[cross.x5/20][cross.y5/20]=1;
                cross.controlRemoveRow();
                if(fieldArray[7][0]===1 || fieldArray[6][0]===1 || fieldArray[8][0]===1 || fieldArray[7][1]===1) pizdets();
                else
                {
                    cross.x1 = 140;
                    cross.y1 = -20;
                    cross.x2 = 120;
                    cross.y2 = 0;
                    cross.x3 = 140;
                    cross.y3 = 0;
                    cross.x4 = 160;
                    cross.y4 = 0;
                    cross.x5 = 140;
                    cross.y5 = 20;
                    go();
                }
            }
        }
    }
    setTimeout(fall121,time);
}
function fall13()
{
    start.removeEventListener('click',fall13);
    start.addEventListener('click', gap);
    function fall131()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', moveTwo);
            window.removeEventListener('keypress', crash);
            clearTimeout(fall131,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall13);
        }
        else
        {
            time = 350;
            if(two.y2!==canvas.height-20 && fieldArray[two.x2/20][two.y2/20+1]!==1)
            {
                two.clear();
                two.fall();
                window.addEventListener('keypress', crash);
                window.addEventListener('keydown', moveTwo);
                fall13();
            }
            else
            {
                time = 0;
                window.removeEventListener('keypress', crash);
                window.removeEventListener('keydown', moveTwo);
                if(fieldArray[7][0]===1) pizdets();
                else
                {
                    two.clear();
                    two.x1 = 140;
                    two.y1 = -20;
                    two.x2 = 140;
                    two.y2 = 0;
                    go();
                }
            }
        }
        
    }
    setTimeout(fall131,time);
}
function fall14()
{
    start.removeEventListener('click',fall14);
    start.addEventListener('click', gap);
    function fall141()
    {
        if(start_pause===true) 
        {
            window.removeEventListener('keydown', moveThree);
            window.removeEventListener('keypress', fill);
            clearTimeout(fall141,time); 
            start_pause=false;
            start.removeEventListener('click', gap); 
            start.addEventListener('click', fall14);
        }
        else
        {
            time = 350;
            if(three.y3!==canvas.height-20 && fieldArray[three.x3/20][three.y3/20+1]!==1)
            {
                three.clear();
                three.fall();
                window.addEventListener('keydown', moveThree);
                window.addEventListener('keypress', fill);
                fall14();
            }
            else
            {
                time = 0;
                window.removeEventListener('keypress', fill);
                window.removeEventListener('keydown', moveThree);
                if(fieldArray[7][1]===1) pizdets();
                else
                {
                    three.clear();
                    three.x1 = 140;
                    three.y1 = -20;
                    three.x2 = 140;
                    three.y2 = 0;
                    three.x3 = 140;
                    three.y3 = 20;
                    go();
                }
            }
        }
    }
    setTimeout(fall141,time);
}

function fill(e)
{
    if(e.key==="c");
    three.tfill();
}
function moveThree(e)
{
    if(e.key==="ArrowLeft" && fieldArray[three.x1/20-1][three.y1/20]!==1 && fieldArray[three.x2/20-1][three.y2/20]!==1 && fieldArray[three.x3/20-1][three.y3/20]!==1)
    {
        three.x1 -= 20;
        three.x2 -= 20;
        three.x3 -= 20;
        three.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(three.x1+2+20, three.y1+2, three.width-4, three.height-4);
        ctx.fillRect(three.x1+5+20, three.y1+5, three.width-10, three.height-10);
        ctx.strokeRect(three.x2+2+20, three.y2+2, three.width-4, three.height-4);
        ctx.fillRect(three.x2+5+20, three.y2+5, three.width-10, three.height-10);
        ctx.strokeRect(three.x3+2+20, three.y3+2, three.width-4, three.height-4);
        ctx.fillRect(three.x3+5+20, three.y3+5, three.width-10, three.height-10);
    }
    if(e.key==="ArrowRight" && fieldArray[three.x1/20+1][three.y1/20]!==1 && fieldArray[three.x2/20+1][three.y2/20]!==1 && fieldArray[three.x3/20+1][three.y3/20]!==1)
    {
        three.x1 += 20;
        three.x2 += 20;
        three.x3 += 20;
        three.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(three.x1+2-20, three.y1+2, three.width-4, three.height-4);
        ctx.fillRect(three.x1+5-20, three.y1+5, three.width-10, three.height-10);
        ctx.strokeRect(three.x2+2-20, three.y2+2, three.width-4, three.height-4);
        ctx.fillRect(three.x2+5-20, three.y2+5, three.width-10, three.height-10);
        ctx.strokeRect(three.x3+2-20, three.y3+2, three.width-4, three.height-4);
        ctx.fillRect(three.x3+5-20, three.y3+5, three.width-10, three.height-10);
    }
    if(e.key==="ArrowDown" && three.y3<canvas.height-20 && fieldArray[(three.x3/20)][three.y3/20+1]!==1)
    {
        three.y1 += 20;
        three.y2 += 20;
        three.y3 += 20;
        three.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(three.x1+2, three.y1+2-20, three.width-4, three.height-4);
        ctx.fillRect(three.x1+5, three.y1+5-20, three.width-10, three.height-10);
    }
}

function crash(e)
{
    if(e.key==="c");
    two.tcrash();
}
function moveTwo(e)
{
    if(e.key==="ArrowLeft" && fieldArray[(two.x1/20)-1][two.y1/20]!==1 && fieldArray[(two.x2/20)-1][two.y2/20]!==1)
    {
        two.x1 -= 20;
        two.x2 -= 20;
        two.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(two.x1+2+20, two.y1+2, two.width-4, two.height-4);
        ctx.fillRect(two.x1+5+20, two.y1+5, two.width-10, two.height-10);
        ctx.strokeRect(two.x2+2+20, two.y2+2, two.width-4, two.height-4);
        ctx.fillRect(two.x2+5+20, two.y2+5, two.width-10, two.height-10);
    }
    if(e.key==="ArrowRight" && fieldArray[(two.x1/20)+1][two.y1/20]!==1 && fieldArray[(two.x2/20)+1][two.y2/20]!==1)
    {
        two.x1 += 20;
        two.x2 += 20;
        two.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(two.x1+2-20, two.y1+2, two.width-4, two.height-4);
        ctx.fillRect(two.x1+5-20, two.y1+5, two.width-10, two.height-10);
        ctx.strokeRect(two.x2+2-20, two.y2+2, two.width-4, two.height-4);
        ctx.fillRect(two.x2+5-20, two.y2+5, two.width-10, two.height-10);
    }
    if(e.key==="ArrowDown" && two.y2<canvas.height-20 && fieldArray[(two.x2/20)][two.y2/20+1]!==1)
    {
        two.y1 += 20;
        two.y2 += 20;
        two.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(two.x1+2, two.y1+2-20, two.width-4, two.height-4);
        ctx.fillRect(two.x1+5, two.y1+5-20, two.width-10, two.height-10);
    }
}

function movetCross(e)
{
    if(e.key==="ArrowLeft" && fieldArray[(cross.x1/20)-1][cross.y1/20]!==1 && fieldArray[(cross.x2/20)-1][cross.y2/20]!==1 && fieldArray[(cross.x5/20)-1][cross.y5/20]!==1)
    {
        cross.x1 -= 20;
        cross.x2 -= 20;
        cross.x3 -= 20;
        cross.x4 -= 20;
        cross.x5 -= 20;
        cross.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(cross.x1+2+20, cross.y1+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x1+5+20, cross.y1+5, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x4+2+20, cross.y4+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x4+5+20, cross.y4+5, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x5+2+20, cross.y5+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x5+5+20, cross.y5+5, cross.width-10, cross.height-10);
    }
    if(e.key==="ArrowRight" && fieldArray[(cross.x1/20)+1][cross.y1/20]!==1 && fieldArray[(cross.x4/20)+1][cross.y4/20]!==1 && fieldArray[(cross.x5/20)+1][cross.y5/20]!==1)
    {
        cross.x1 += 20;
        cross.x2 += 20;
        cross.x3 += 20;
        cross.x4 += 20;
        cross.x5 += 20;
        cross.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(cross.x1+2-20, cross.y1+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x1+5-20, cross.y1+5, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x2+2-20, cross.y2+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x2+5-20, cross.y2+5, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x5+2-20, cross.y5+2, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x5+5-20, cross.y5+5, cross.width-10, cross.height-10);
    }
    if(e.key==="ArrowDown" && cross.y5<canvas.height-20
       && fieldArray[(cross.x2/20)][cross.y2/20+1]!==1 && fieldArray[(cross.x4/20)][cross.y4/20+1]!==1 && fieldArray[(cross.x5/20)][cross.y5/20+1]!==1)
    {
        cross.y1 += 20;
        cross.y2 += 20;
        cross.y3 += 20;
        cross.y4 += 20;
        cross.y5 += 20;
        cross.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(cross.x1+2, cross.y1+2-20, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x1+5, cross.y1+5-20, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x2+2, cross.y2+2-20, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x2+5, cross.y2+5-20, cross.width-10, cross.height-10);
        ctx.strokeRect(cross.x4+2, cross.y4+2-20, cross.width-4, cross.height-4);
        ctx.fillRect(cross.x4+5, cross.y4+5-20, cross.width-10, cross.height-10);
    }
}

function rotatetBigZv(e)
{
    if(e.key==="c")
    bigZv.rotatetBigZv();
}
function movetBigZv(e)
{
    if(e.key==="ArrowLeft" && counterBigZv===0 
       && fieldArray[(bigZv.x2/20)-1][bigZv.y2/20]!==1 && fieldArray[(bigZv.x5/20)-1][bigZv.y5/20]!==1 && fieldArray[(bigZv.x3/20)-1][bigZv.y3/20]!==1)
    {
        bigZv.x1 -= 20;
        bigZv.x2 -= 20;
        bigZv.x3 -= 20;
        bigZv.x4 -= 20;
        bigZv.x5 -= 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x3+2+20, bigZv.y3+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x3+5+20, bigZv.y3+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x1+2+20, bigZv.y1+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x1+5+20, bigZv.y1+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x4+2+20, bigZv.y4+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x4+5+20, bigZv.y4+5, bigZv.width-10, bigZv.height-10);
    }
    if(e.key==="ArrowLeft" && counterBigZv===1 
       && fieldArray[(bigZv.x1/20)-1][bigZv.y1/20]!==1 && fieldArray[(bigZv.x5/20)-1][bigZv.y5/20]!==1 && fieldArray[(bigZv.x4/20)-1][bigZv.y4/20]!==1)
    {
        bigZv.x1 -= 20;
        bigZv.x2 -= 20;
        bigZv.x3 -= 20;
        bigZv.x4 -= 20;
        bigZv.x5 -= 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x2+2+20, bigZv.y2+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x2+5+20, bigZv.y2+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x1+2+20, bigZv.y1+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x1+5+20, bigZv.y1+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x5+2+20, bigZv.y5+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x5+5+20, bigZv.y5+5, bigZv.width-10, bigZv.height-10);
    }

    if(e.key==="ArrowRight" && counterBigZv===0 
       && fieldArray[(bigZv.x1/20)+1][bigZv.y1/20]!==1 && fieldArray[(bigZv.x4/20)+1][bigZv.y4/20]!==1 && fieldArray[(bigZv.x3/20)+1][bigZv.y3/20]!==1)
    {
        bigZv.x1 += 20;
        bigZv.x2 += 20;
        bigZv.x3 += 20;
        bigZv.x4 += 20;
        bigZv.x5 += 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x3+2-20, bigZv.y3+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x3+5-20, bigZv.y3+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x2+2-20, bigZv.y2+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x2+5-20, bigZv.y2+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x5+2-20, bigZv.y5+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x5+5-20, bigZv.y5+5, bigZv.width-10, bigZv.height-10);
    }
    if(e.key==="ArrowRight" && counterBigZv===1
       && fieldArray[(bigZv.x1/20)+1][bigZv.y1/20]!==1 && fieldArray[(bigZv.x2/20)+1][bigZv.y2/20]!==1 && fieldArray[(bigZv.x5/20)+1][bigZv.y5/20]!==1)
    {
        bigZv.x1 += 20;
        bigZv.x2 += 20;
        bigZv.x3 += 20;
        bigZv.x4 += 20;
        bigZv.x5 += 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x1+2-20, bigZv.y1+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x1+5-20, bigZv.y1+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x4+2-20, bigZv.y4+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x4+5-20, bigZv.y4+5, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x5+2-20, bigZv.y5+2, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x5+5-20, bigZv.y5+5, bigZv.width-10, bigZv.height-10);
    }

    if(e.key==="ArrowDown" && counterBigZv===0 && bigZv.y4<canvas.height-20
       && fieldArray[(bigZv.x1/20)][bigZv.y1/20+1]!==1 && fieldArray[(bigZv.x4/20)][bigZv.y4/20+1]!==1 && fieldArray[(bigZv.x5/20)][bigZv.y5/20+1]!==1)
    {
        bigZv.y1 += 20;
        bigZv.y2 += 20;
        bigZv.y3 += 20;
        bigZv.y4 += 20;
        bigZv.y5 += 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x1+2, bigZv.y1+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x1+5, bigZv.y1+5-20, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x2+2, bigZv.y2+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x2+5, bigZv.y2+5-20, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x5+2, bigZv.y5+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x5+5, bigZv.y5+5-20, bigZv.width-10, bigZv.height-10);
    }
    if(e.key==="ArrowDown" && counterBigZv===1 && bigZv.y1<canvas.height-20
       && fieldArray[(bigZv.x1/20)][bigZv.y1/20+1]!==1 && fieldArray[(bigZv.x4/20)][bigZv.y4/20+1]!==1 && fieldArray[(bigZv.x3/20)][bigZv.y3/20+1]!==1)
    {
        bigZv.y1 += 20;
        bigZv.y2 += 20;
        bigZv.y3 += 20;
        bigZv.y4 += 20;
        bigZv.y5 += 20;
        bigZv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZv.x3+2, bigZv.y3+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x3+5, bigZv.y3+5-20, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x2+2, bigZv.y2+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x2+5, bigZv.y2+5-20, bigZv.width-10, bigZv.height-10);
        ctx.strokeRect(bigZv.x5+2, bigZv.y5+2-20, bigZv.width-4, bigZv.height-4);
        ctx.fillRect(bigZv.x5+5, bigZv.y5+5-20, bigZv.width-10, bigZv.height-10);
    }
}

function rotatetBigZ(e)
{
    if(e.key==="c")
    bigZ.rotatetBigZ();
}
function movetBigZ(e)
{
    if(e.key==="ArrowLeft" && counterBigZ===0 
       && fieldArray[(bigZ.x1/20)-1][bigZ.y1/20]!==1 && fieldArray[(bigZ.x4/20)-1][bigZ.y4/20]!==1 && fieldArray[(bigZ.x3/20)-1][bigZ.y3/20]!==1)
    {
        bigZ.x1 -= 20;
        bigZ.x2 -= 20;
        bigZ.x3 -= 20;
        bigZ.x4 -= 20;
        bigZ.x5 -= 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x3+2+20, bigZ.y3+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x3+5+20, bigZ.y3+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x2+2+20, bigZ.y2+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x2+5+20, bigZ.y2+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x5+2+20, bigZ.y5+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x5+5+20, bigZ.y5+5, bigZ.width-10, bigZ.height-10);
    }
    if(e.key==="ArrowLeft" && counterBigZ===1 
       && fieldArray[(bigZ.x1/20)-1][bigZ.y1/20]!==1 && fieldArray[(bigZ.x2/20)-1][bigZ.y2/20]!==1 && fieldArray[(bigZ.x5/20)-1][bigZ.y5/20]!==1)
    {
        bigZ.x1 -= 20;
        bigZ.x2 -= 20;
        bigZ.x3 -= 20;
        bigZ.x4 -= 20;
        bigZ.x5 -= 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x1+2+20, bigZ.y1+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x1+5+20, bigZ.y1+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x4+2+20, bigZ.y4+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x4+5+20, bigZ.y4+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x5+2+20, bigZ.y5+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x5+5+20, bigZ.y5+5, bigZ.width-10, bigZ.height-10);
    }

    if(e.key==="ArrowRight" && counterBigZ===0 
       && fieldArray[(bigZ.x2/20)+1][bigZ.y2/20]!==1 && fieldArray[(bigZ.x3/20)+1][bigZ.y3/20]!==1 && fieldArray[(bigZ.x5/20)+1][bigZ.y5/20]!==1)
    {
        bigZ.x1 += 20;
        bigZ.x2 += 20;
        bigZ.x3 += 20;
        bigZ.x4 += 20;
        bigZ.x5 += 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x3+2-20, bigZ.y3+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x3+5-20, bigZ.y3+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x1+2-20, bigZ.y1+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x1+5-20, bigZ.y1+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x4+2-20, bigZ.y4+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x4+5-20, bigZ.y4+5, bigZ.width-10, bigZ.height-10);
    }
    if(e.key==="ArrowRight" && counterBigZ===1 
       && fieldArray[(bigZ.x1/20)+1][bigZ.y1/20]!==1 && fieldArray[(bigZ.x4/20)+1][bigZ.y4/20]!==1 && fieldArray[(bigZ.x5/20)+1][bigZ.y5/20]!==1)
    {
        bigZ.x1 += 20;
        bigZ.x2 += 20;
        bigZ.x3 += 20;
        bigZ.x4 += 20;
        bigZ.x5 += 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x2+2-20, bigZ.y2+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x2+5-20, bigZ.y2+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x1+2-20, bigZ.y1+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x1+5-20, bigZ.y1+5, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x5+2-20, bigZ.y5+2, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x5+5-20, bigZ.y5+5, bigZ.width-10, bigZ.height-10);
    }

    if(e.key==="ArrowDown" && counterBigZ===0 && bigZ.y4<canvas.height-20
       && fieldArray[(bigZ.x1/20)][bigZ.y1/20+1]!==1 && fieldArray[(bigZ.x4/20)][bigZ.y4/20+1]!==1 && fieldArray[(bigZ.x5/20)][bigZ.y5/20+1]!==1)
    {
        bigZ.y1 += 20;
        bigZ.y2 += 20;
        bigZ.y3 += 20;
        bigZ.y4 += 20;
        bigZ.y5 += 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x2+2, bigZ.y2+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x2+5, bigZ.y2+5-20, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x1+2, bigZ.y1+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x1+5, bigZ.y1+5-20, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x5+2, bigZ.y5+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x5+5, bigZ.y5+5-20, bigZ.width-10, bigZ.height-10);
    }
    if(e.key==="ArrowDown" && counterBigZ===1 && bigZ.y1<canvas.height-20
       && fieldArray[(bigZ.x1/20)][bigZ.y1/20+1]!==1 && fieldArray[(bigZ.x4/20)][bigZ.y4/20+1]!==1 && fieldArray[(bigZ.x3/20)][bigZ.y3/20+1]!==1)
    {
        bigZ.y1 += 20;
        bigZ.y2 += 20;
        bigZ.y3 += 20;
        bigZ.y4 += 20;
        bigZ.y5 += 20;
        bigZ.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigZ.x2+2, bigZ.y2+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x2+5, bigZ.y2+5-20, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x3+2, bigZ.y3+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x3+5, bigZ.y3+5-20, bigZ.width-10, bigZ.height-10);
        ctx.strokeRect(bigZ.x5+2, bigZ.y5+2-20, bigZ.width-4, bigZ.height-4);
        ctx.fillRect(bigZ.x5+5, bigZ.y5+5-20, bigZ.width-10, bigZ.height-10);
    }
}

function rotatetBigT(e)
{
    if(e.key==="c")
    bigT.rotatetBigT();
}
function movetBigT(e)
{
    if(e.key==="ArrowLeft" && counterBigT===0 
       && fieldArray[(bigT.x1/20)-1][bigT.y1/20]!==1 && fieldArray[(bigT.x4/20)-1][bigT.y4/20]!==1 && fieldArray[(bigT.x5/20)-1][bigT.y5/20]!==1)
    {
        bigT.x1 -= 20;
        bigT.x2 -= 20;
        bigT.x3 -= 20;
        bigT.x4 -= 20;
        bigT.x5 -= 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x3+2+20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5+20, bigT.y3+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2+20, bigT.y4+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5+20, bigT.y4+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2+20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5+20, bigT.y5+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowLeft" && counterBigT===1 
       && fieldArray[(bigT.x1/20)-1][bigT.y1/20]!==1 && fieldArray[(bigT.x3/20)-1][bigT.y3/20]!==1 && fieldArray[(bigT.x5/20)-1][bigT.y5/20]!==1)
    {
        bigT.x1 -= 20;
        bigT.x2 -= 20;
        bigT.x3 -= 20;
        bigT.x4 -= 20;
        bigT.x5 -= 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2+20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5+20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x2+2+20, bigT.y2+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x2+5+20, bigT.y2+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2+20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5+20, bigT.y3+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowLeft" && counterBigT===2
       && fieldArray[(bigT.x4/20)-1][bigT.y4/20]!==1 && fieldArray[(bigT.x3/20)-1][bigT.y3/20]!==1 && fieldArray[(bigT.x5/20)-1][bigT.y5/20]!==1)
    {
        bigT.x1 -= 20;
        bigT.x2 -= 20;
        bigT.x3 -= 20;
        bigT.x4 -= 20;
        bigT.x5 -= 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2+20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5+20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2+20, bigT.y4+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5+20, bigT.y4+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2+20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5+20, bigT.y5+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowLeft" && counterBigT===3
       && fieldArray[(bigT.x1/20)-1][bigT.y1/20]!==1 && fieldArray[(bigT.x3/20)-1][bigT.y3/20]!==1 && fieldArray[(bigT.x2/20)-1][bigT.y2/20]!==1)
    {
        bigT.x1 -= 20;
        bigT.x2 -= 20;
        bigT.x3 -= 20;
        bigT.x4 -= 20;
        bigT.x5 -= 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2+20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5+20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2+20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5+20, bigT.y5+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2+20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5+20, bigT.y3+5, bigT.width-10, bigT.height-10);
    }

    if(e.key==="ArrowRight" && counterBigT===0 
       && fieldArray[(bigT.x3/20)+1][bigT.y3/20]!==1 && fieldArray[(bigT.x4/20)+1][bigT.y4/20]!==1 && fieldArray[(bigT.x5/20)+1][bigT.y5/20]!==1)
    {
        bigT.x1 += 20;
        bigT.x2 += 20;
        bigT.x3 += 20;
        bigT.x4 += 20;
        bigT.x5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2-20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5-20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2-20, bigT.y4+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5-20, bigT.y4+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2-20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5-20, bigT.y5+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowRight" && counterBigT===1
       && fieldArray[(bigT.x1/20)+1][bigT.y1/20]!==1 && fieldArray[(bigT.x3/20)+1][bigT.y3/20]!==1 && fieldArray[(bigT.x2/20)+1][bigT.y2/20]!==1)
    {
        bigT.x1 += 20;
        bigT.x2 += 20;
        bigT.x3 += 20;
        bigT.x4 += 20;
        bigT.x5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2-20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5-20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2-20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5-20, bigT.y5+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2-20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5-20, bigT.y3+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowRight" && counterBigT===2 && bigT.x1!==canvas.width-20
       && fieldArray[(bigT.x4/20)+1][bigT.y4/20]!==1 && fieldArray[(bigT.x1/20)+1][bigT.y1/20]!==1 && fieldArray[(bigT.x5/20)+1][bigT.y5/20]!==1)
    {
        bigT.x1 += 20;
        bigT.x2 += 20;
        bigT.x3 += 20;
        bigT.x4 += 20;
        bigT.x5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x3+2-20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5-20, bigT.y3+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2-20, bigT.y4+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5-20, bigT.y4+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2-20, bigT.y5+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5-20, bigT.y5+5, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowRight" && counterBigT===3
       && fieldArray[(bigT.x1/20)+1][bigT.y1/20]!==1 && fieldArray[(bigT.x3/20)+1][bigT.y3/20]!==1 && fieldArray[(bigT.x5/20)+1][bigT.y5/20]!==1)
    {
        bigT.x1 += 20;
        bigT.x2 += 20;
        bigT.x3 += 20;
        bigT.x4 += 20;
        bigT.x5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2-20, bigT.y1+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5-20, bigT.y1+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x2+2-20, bigT.y2+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x2+5-20, bigT.y2+5, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2-20, bigT.y3+2, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5-20, bigT.y3+5, bigT.width-10, bigT.height-10);
    }

    if(e.key==="ArrowDown" && counterBigT===0 && bigT.y5<canvas.height-20
       && fieldArray[(bigT.x1/20)][bigT.y1/20+1]!==1 && fieldArray[(bigT.x3/20)][bigT.y3/20+1]!==1 && fieldArray[(bigT.x5/20)][bigT.y5/20+1]!==1)
    {
        bigT.y1 += 20;
        bigT.y2 += 20;
        bigT.y3 += 20;
        bigT.y4 += 20;
        bigT.y5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2, bigT.y1+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5, bigT.y1+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x2+2, bigT.y2+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x2+5, bigT.y2+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2, bigT.y3+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5, bigT.y3+5-20, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowDown" && counterBigT===1 && bigT.y3<canvas.height-20
       && fieldArray[(bigT.x4/20)][bigT.y4/20+1]!==1 && fieldArray[(bigT.x3/20)][bigT.y3/20+1]!==1 && fieldArray[(bigT.x5/20)][bigT.y5/20+1]!==1)
    {
        bigT.y1 += 20;
        bigT.y2 += 20;
        bigT.y3 += 20;
        bigT.y4 += 20;
        bigT.y5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2, bigT.y1+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5, bigT.y1+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2, bigT.y4+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5, bigT.y4+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2, bigT.y5+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5, bigT.y5+5-20, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowDown" && counterBigT===2 && bigT.y2<canvas.height-20
       && fieldArray[(bigT.x1/20)][bigT.y1/20+1]!==1 && fieldArray[(bigT.x3/20)][bigT.y3/20+1]!==1 && fieldArray[(bigT.x2/20)][bigT.y2/20+1]!==1)
    {
        bigT.y1 += 20;
        bigT.y2 += 20;
        bigT.y3 += 20;
        bigT.y4 += 20;
        bigT.y5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x1+2, bigT.y1+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x1+5, bigT.y1+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2, bigT.y5+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5, bigT.y5+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x3+2, bigT.y3+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5, bigT.y3+5-20, bigT.width-10, bigT.height-10);
    }
    if(e.key==="ArrowDown" && counterBigT===3 && bigT.y1<canvas.height-20
       && fieldArray[(bigT.x4/20)][bigT.y4/20+1]!==1 && fieldArray[(bigT.x1/20)][bigT.y1/20+1]!==1 && fieldArray[(bigT.x5/20)][bigT.y5/20+1]!==1)
    {
        bigT.y1 += 20;
        bigT.y2 += 20;
        bigT.y3 += 20;
        bigT.y4 += 20;
        bigT.y5 += 20;
        bigT.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(bigT.x3+2, bigT.y3+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x3+5, bigT.y3+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x4+2, bigT.y4+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x4+5, bigT.y4+5-20, bigT.width-10, bigT.height-10);
        ctx.strokeRect(bigT.x5+2, bigT.y5+2-20, bigT.width-4, bigT.height-4);
        ctx.fillRect(bigT.x5+5, bigT.y5+5-20, bigT.width-10, bigT.height-10);
    }
}

function rotatetStick(e)
{
    if(e.key==="c")
    stick.rotatetStick();
}
function movetStick(e)
{
    if(e.key==="ArrowLeft" && countertStick===0 && fieldArray[(stick.x1/20)-1][stick.y1/20]!==1)
    {
        stick.x1 -= 20;
        stick.x2 -= 20;
        stick.x3 -= 20;
        stick.x4 -= 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x4+2+20, stick.y4+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x4+5+20, stick.y4+5, stick.width-10, stick.height-10);
    }
    else if(e.key==="ArrowLeft" && countertStick===1 && fieldArray[(stick.x1/20)-1][stick.y1/20]!==1 && fieldArray[(stick.x2/20)-1][stick.y2/20]!==1
        && fieldArray[(stick.x3/20)-1][stick.y3/20]!==1 && fieldArray[(stick.x4/20)-1][stick.y4/20]!==1)
    {
        stick.x1 -= 20;
        stick.x2 -= 20;
        stick.x3 -= 20;
        stick.x4 -= 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x1+2+20, stick.y1+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x1+5+20, stick.y1+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x2+2+20, stick.y2+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x2+5+20, stick.y2+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x3+2+20, stick.y3+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x3+5+20, stick.y3+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x4+2+20, stick.y4+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x4+5+20, stick.y4+5, stick.width-10, stick.height-10);
    }
    if(e.key==="ArrowRight" && stick.x4<canvas.width-20 && countertStick===0 && fieldArray[(stick.x4/20)+1][stick.y4/20]!==1)
    {
        stick.x1 += 20;
        stick.x2 += 20;
        stick.x3 += 20;
        stick.x4 += 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x1+2-20, stick.y1+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x1+5-20, stick.y1+5, stick.width-10, stick.height-10);
    }
    else if(e.key==="ArrowRight" && countertStick===1 && fieldArray[(stick.x1/20)+1][stick.y1/20]!==1 && fieldArray[(stick.x2/20)+1][stick.y2/20]!==1
        && fieldArray[(stick.x3/20)+1][stick.y3/20]!==1 && fieldArray[(stick.x4/20)+1][stick.y4/20]!==1)
    {
        stick.x1 += 20;
        stick.x2 += 20;
        stick.x3 += 20;
        stick.x4 += 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x1+2-20, stick.y1+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x1+5-20, stick.y1+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x2+2-20, stick.y2+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x2+5-20, stick.y2+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x3+2-20, stick.y3+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x3+5-20, stick.y3+5, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x4+2-20, stick.y4+2, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x4+5-20, stick.y4+5, stick.width-10, stick.height-10);
    }
    if(e.key==="ArrowDown" && countertStick===0 && stick.y4<canvas.height-20 && fieldArray[(stick.x1/20)][stick.y1/20+1]!==1 && fieldArray[(stick.x2/20)][stick.y2/20+1]!==1
        && fieldArray[(stick.x3/20)][stick.y3/20+1]!==1 && fieldArray[(stick.x4/20)][stick.y4/20+1]!==1)
    {
        stick.y1 += 20;
        stick.y2 += 20;
        stick.y3 += 20;
        stick.y4 += 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x1+2, stick.y1+2-20, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x1+5, stick.y1+5-20, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x2+2, stick.y2+2-20, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x2+5, stick.y2+5-20, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x3+2, stick.y3+2-20, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x3+5, stick.y3+5-20, stick.width-10, stick.height-10);
        ctx.strokeRect(stick.x4+2, stick.y4+2-20, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x4+5, stick.y4+5-20, stick.width-10, stick.height-10);
    }
    if(e.key==="ArrowDown" && countertStick===1 && stick.y4<canvas.height-20 && fieldArray[(stick.x4/20)][stick.y4/20+1]!==1)
    {
        stick.y1 += 20;
        stick.y2 += 20;
        stick.y3 += 20;
        stick.y4 += 20;
        stick.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(stick.x1+2, stick.y1+2-20, stick.width-4, stick.height-4);
        ctx.fillRect(stick.x1+5, stick.y1+5-20, stick.width-10, stick.height-10);
    }
}

function rotatetGv(e)
{
    if(e.key==="c")
    tgv.rotatetGv();
}
function movetGv(e)
{
    if(e.key==="ArrowLeft" && countertGv===0 && tgv.x1>0 && fieldArray[(tgv.x1/20)-1][tgv.y1/20]!==1 && fieldArray[(tgv.x4/20)-1][tgv.y4/20]!==1)
    {
        tgv.x1 -= 20;
        tgv.x2 -= 20;
        tgv.x3 -= 20;
        tgv.x4 -= 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x3+2+20, tgv.y3+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5+20, tgv.y3+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2+20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5+20, tgv.y4+5, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowLeft" && countertGv===1 && tgv.x4>0 && fieldArray[(tgv.x3/20)-1][tgv.y3/20]!==1 && fieldArray[(tgv.x2/20)-1][tgv.y2/20]!==1
            && fieldArray[(tgv.x4/20)-1][tgv.y4/20]!==1)
            {
                tgv.x1 -= 20;
                tgv.x2 -= 20;
                tgv.x3 -= 20;
                tgv.x4 -= 20;
                tgv.setBlock();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.strokeRect(tgv.x3+2+20, tgv.y3+2, tgv.width-4, tgv.height-4);
                ctx.fillRect(tgv.x3+5+20, tgv.y3+5, tgv.width-10, tgv.height-10);
                ctx.strokeRect(tgv.x2+2+20, tgv.y2+2, tgv.width-4, tgv.height-4);
                ctx.fillRect(tgv.x2+5+20, tgv.y2+5, tgv.width-10, tgv.height-10);
                ctx.strokeRect(tgv.x1+2+20, tgv.y1+2, tgv.width-4, tgv.height-4);
                ctx.fillRect(tgv.x1+5+20, tgv.y1+5, tgv.width-10, tgv.height-10);
            }
    else if(e.key==="ArrowLeft" && countertGv===2 && tgv.x3>0 && fieldArray[(tgv.x3/20)-1][tgv.y3/20]!==1 && fieldArray[(tgv.x4/20)-1][tgv.y4/20]!==1)
    {
        tgv.x1 -= 20;
        tgv.x2 -= 20;
        tgv.x3 -= 20;
        tgv.x4 -= 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x1+2+20, tgv.y1+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x1+5+20, tgv.y1+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2+20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5+20, tgv.y4+5, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowLeft" && countertGv===3 && tgv.x3>0 && fieldArray[(tgv.x1/20)-1][tgv.y1/20]!==1 && fieldArray[(tgv.x2/20)-1][tgv.y2/20]!==1
            && fieldArray[(tgv.x3/20)-1][tgv.y3/20]!==1)
    {
        tgv.x1 -= 20;
        tgv.x2 -= 20;
        tgv.x3 -= 20;
        tgv.x4 -= 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x4+2+20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5+20, tgv.y4+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x2+2+20, tgv.y2+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x2+5+20, tgv.y2+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x3+2+20, tgv.y3+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5+20, tgv.y3+5, tgv.width-10, tgv.height-10);
    }

    if(e.key==="ArrowRight" && countertGv===0 && tgv.x3<canvas.width-20 && fieldArray[(tgv.x3/20)+1][tgv.y3/20]!==1 && fieldArray[(tgv.x4/20)+1][tgv.y4/20]!==1)
    {
        tgv.x1 += 20;
        tgv.x2 += 20;
        tgv.x3 += 20;
        tgv.x4 += 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x1+2-20, tgv.y1+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x1+5-20, tgv.y1+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2-20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5-20, tgv.y4+5, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowRight" && countertGv===1 && tgv.x3<canvas.width-20
            && fieldArray[(tgv.x1/20)+1][tgv.y1/20]!==1 && fieldArray[(tgv.x2/20)+1][tgv.y2/20]!==1 && fieldArray[(tgv.x3/20)+1][tgv.y3/20]!==1)
    {
        tgv.x1 += 20;
        tgv.x2 += 20;
        tgv.x3 += 20;
        tgv.x4 += 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x3+2-20, tgv.y3+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5-20, tgv.y3+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x2+2-20, tgv.y2+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x2+5-20, tgv.y2+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2-20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5-20, tgv.y4+5, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowRight" && countertGv===2 && tgv.x1<canvas.width-20 && fieldArray[(tgv.x1/20)+1][tgv.y1/20]!==1 && fieldArray[(tgv.x4/20)+1][tgv.y4/20]!==1)
    {
        tgv.x1 += 20;
        tgv.x2 += 20;
        tgv.x3 += 20;
        tgv.x4 += 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x3+2-20, tgv.y3+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5-20, tgv.y3+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2-20, tgv.y4+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5-20, tgv.y4+5, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowRight" && countertGv===3 && tgv.x4<canvas.width-20
            && fieldArray[(tgv.x3/20)+1][tgv.y3/20]!==1 && fieldArray[(tgv.x2/20)+1][tgv.y2/20]!==1 && fieldArray[(tgv.x4/20)+1][tgv.y4/20]!==1)
    {
        tgv.x1 += 20;
        tgv.x2 += 20;
        tgv.x3 += 20;
        tgv.x4 += 20;
        tgv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x1+2-20, tgv.y1+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x1+5-20, tgv.y1+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x2+2-20, tgv.y2+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x2+5-20, tgv.y2+5, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x3+2-20, tgv.y3+2, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5-20, tgv.y3+5, tgv.width-10, tgv.height-10);
    }

    if(e.key==="ArrowDown" && countertGv===0 && tgv.y4<canvas.height-20 
       && fieldArray[(tgv.x3/20)][tgv.y3/20+1]!==1 && fieldArray[(tgv.x2/20)][tgv.y2/20+1]!==1 && fieldArray[(tgv.x4/20)][tgv.y4/20+1]!==1)
    {
        tgv.y1 += 20;
        tgv.y2 += 20;
        tgv.y3 += 20;
        tgv.y4 += 20;
        tgv.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x1+2, tgv.y1+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x1+5, tgv.y1+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x2+2, tgv.y2+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x2+5, tgv.y2+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x3+2, tgv.y3+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5, tgv.y3+5-20, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowDown" && countertGv===1 && tgv.y3<canvas.height-20 && fieldArray[(tgv.x3/20)][tgv.y3/20+1]!==1 && fieldArray[(tgv.x4/20)][tgv.y4/20+1]!==1)
    {
        tgv.y1 += 20;
        tgv.y2 += 20;
        tgv.y3 += 20;
        tgv.y4 += 20;
        tgv.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x1+2, tgv.y1+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x1+5, tgv.y1+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2, tgv.y4+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5, tgv.y4+5-20, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowDown" && countertGv===2 && tgv.y1<canvas.height-20 
    && fieldArray[(tgv.x1/20)][tgv.y1/20+1]!==1 && fieldArray[(tgv.x2/20)][tgv.y2/20+1]!==1 && fieldArray[(tgv.x3/20)][tgv.y3/20+1]!==1)
    {
        tgv.y1 += 20;
        tgv.y2 += 20;
        tgv.y3 += 20;
        tgv.y4 += 20;
        tgv.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x3+2, tgv.y3+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5, tgv.y3+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x2+2, tgv.y2+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x2+5, tgv.y2+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2, tgv.y4+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5, tgv.y4+5-20, tgv.width-10, tgv.height-10);
    }
    else if(e.key==="ArrowDown" && countertGv===3 && tgv.y1<canvas.height-20 && fieldArray[(tgv.x1/20)][tgv.y1/20+1]!==1 && fieldArray[(tgv.x4/20)][tgv.y4/20+1]!==1)
    {
        tgv.y1 += 20;
        tgv.y2 += 20;
        tgv.y3 += 20;
        tgv.y4 += 20;
        tgv.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tgv.x3+2, tgv.y3+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x3+5, tgv.y3+5-20, tgv.width-10, tgv.height-10);
        ctx.strokeRect(tgv.x4+2, tgv.y4+2-20, tgv.width-4, tgv.height-4);
        ctx.fillRect(tgv.x4+5, tgv.y4+5-20, tgv.width-10, tgv.height-10);
    }
}

function rotatetG(e)
{
    if(e.key==="c")
    tg.rotatetG();
}
function movetG(e)
{
    if(e.key==="ArrowLeft" && countertG===0 && tg.x1>0 && fieldArray[(tg.x1/20)-1][tg.y1/20]!==1 && fieldArray[(tg.x4/20)-1][tg.y4/20]!==1)
    {
        tg.x1 -= 20;
        tg.x2 -= 20;
        tg.x3 -= 20;
        tg.x4 -= 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x3+2+20, tg.y3+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5+20, tg.y3+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2+20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5+20, tg.y4+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowLeft" && countertG===1 && tg.x4>0 && fieldArray[(tg.x1/20)-1][tg.y1/20]!==1 && fieldArray[(tg.x2/20)-1][tg.y2/20]!==1
            && fieldArray[(tg.x4/20)-1][tg.y4/20]!==1)
    {
        tg.x1 -= 20;
        tg.x2 -= 20;
        tg.x3 -= 20;
        tg.x4 -= 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x3+2+20, tg.y3+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5+20, tg.y3+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2+20, tg.y2+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5+20, tg.y2+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x1+2+20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5+20, tg.y1+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowLeft" && countertG===2 && tg.x3>0 && fieldArray[(tg.x3/20)-1][tg.y3/20]!==1 && fieldArray[(tg.x4/20)-1][tg.y4/20]!==1)
    {
        tg.x1 -= 20;
        tg.x2 -= 20;
        tg.x3 -= 20;
        tg.x4 -= 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2+20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5+20, tg.y1+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2+20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5+20, tg.y4+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowLeft" && countertG===3 && tg.x3>0 && fieldArray[(tg.x1/20)-1][tg.y1/20]!==1 && fieldArray[(tg.x2/20)-1][tg.y2/20]!==1
            && fieldArray[(tg.x3/20)-1][tg.y3/20]!==1)
    {
        tg.x1 -= 20;
        tg.x2 -= 20;
        tg.x3 -= 20;
        tg.x4 -= 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x4+2+20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5+20, tg.y4+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2+20, tg.y2+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5+20, tg.y2+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x1+2+20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5+20, tg.y1+5, tg.width-10, tg.height-10);
    }

    if(e.key==="ArrowRight" && countertG===0 && tg.x3<canvas.width-20 && fieldArray[(tg.x3/20)+1][tg.y3/20]!==1 && fieldArray[(tg.x4/20)+1][tg.y4/20]!==1)
    {
        tg.x1 += 20;
        tg.x2 += 20;
        tg.x3 += 20;
        tg.x4 += 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2-20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5-20, tg.y1+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2-20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5-20, tg.y4+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowRight" && countertG===1 && tg.x3<canvas.width-20
            && fieldArray[(tg.x1/20)+1][tg.y1/20]!==1 && fieldArray[(tg.x2/20)+1][tg.y2/20]!==1 && fieldArray[(tg.x3/20)+1][tg.y3/20]!==1)
    {
        tg.x1 += 20;
        tg.x2 += 20;
        tg.x3 += 20;
        tg.x4 += 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2-20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5-20, tg.y1+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2-20, tg.y2+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5-20, tg.y2+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2-20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5-20, tg.y4+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowRight" && countertG===2 && tg.x1<canvas.width-20 && fieldArray[(tg.x1/20)+1][tg.y1/20]!==1 && fieldArray[(tg.x4/20)+1][tg.y4/20]!==1)
    {
        tg.x1 += 20;
        tg.x2 += 20;
        tg.x3 += 20;
        tg.x4 += 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x3+2-20, tg.y3+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5-20, tg.y3+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2-20, tg.y4+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5-20, tg.y4+5, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowRight" && countertG===3 && tg.x4<canvas.width-20
            && fieldArray[(tg.x1/20)+1][tg.y1/20]!==1 && fieldArray[(tg.x2/20)+1][tg.y2/20]!==1 && fieldArray[(tg.x4/20)+1][tg.y4/20]!==1)
    {
        tg.x1 += 20;
        tg.x2 += 20;
        tg.x3 += 20;
        tg.x4 += 20;
        tg.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2-20, tg.y1+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5-20, tg.y1+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2-20, tg.y2+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5-20, tg.y2+5, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x3+2-20, tg.y3+2, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5-20, tg.y3+5, tg.width-10, tg.height-10);
    }

    if(e.key==="ArrowDown" && countertG===0 && tg.y4<canvas.height-20 
       && fieldArray[(tg.x1/20)][tg.y1/20+1]!==1 && fieldArray[(tg.x2/20)][tg.y2/20+1]!==1 && fieldArray[(tg.x4/20)][tg.y4/20+1]!==1)
    {
        tg.y1 += 20;
        tg.y2 += 20;
        tg.y3 += 20;
        tg.y4 += 20;
        tg.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2, tg.y1+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5, tg.y1+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2, tg.y2+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5, tg.y2+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x3+2, tg.y3+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5, tg.y3+5-20, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowDown" && countertG===1 && tg.y4<canvas.height-20 && fieldArray[(tg.x3/20)][tg.y3/20+1]!==1 && fieldArray[(tg.x4/20)][tg.y4/20+1]!==1)
    {
        tg.y1 += 20;
        tg.y2 += 20;
        tg.y3 += 20;
        tg.y4 += 20;
        tg.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2, tg.y1+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5, tg.y1+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2, tg.y4+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5, tg.y4+5-20, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowDown" && countertG===2 && tg.y1<canvas.height-20 
            && fieldArray[(tg.x1/20)][tg.y1/20+1]!==1 && fieldArray[(tg.x2/20)][tg.y2/20+1]!==1 && fieldArray[(tg.x3/20)][tg.y3/20+1]!==1)
    {
        tg.y1 += 20;
        tg.y2 += 20;
        tg.y3 += 20;
        tg.y4 += 20;
        tg.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x1+2, tg.y1+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x1+5, tg.y1+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x2+2, tg.y2+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x2+5, tg.y2+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2, tg.y4+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5, tg.y4+5-20, tg.width-10, tg.height-10);
    }
    else if(e.key==="ArrowDown" && countertG===3 && tg.y1<canvas.height-20 && fieldArray[(tg.x1/20)][tg.y1/20+1]!==1 && fieldArray[(tg.x4/20)][tg.y4/20+1]!==1)
    {
        tg.y1 += 20;
        tg.y2 += 20;
        tg.y3 += 20;
        tg.y4 += 20;
        tg.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tg.x3+2, tg.y3+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x3+5, tg.y3+5-20, tg.width-10, tg.height-10);
        ctx.strokeRect(tg.x4+2, tg.y4+2-20, tg.width-4, tg.height-4);
        ctx.fillRect(tg.x4+5, tg.y4+5-20, tg.width-10, tg.height-10);
    }
}

function rotate(e)
{
    if(e.key==="c")
    tank.rotatetTank();
}
function movetTank(e)
{
    if (e.key==="ArrowLeft" && counterTank===0 && tank.x1>0 && fieldArray[(tank.x1/20)-1][tank.y1/20]!==1 && fieldArray[(tank.x4/20)-1][tank.y4/20]!==1) 
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tank.x1+2-20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5-20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2-20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5-20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2-20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5-20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2-20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5-20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 -= 20;
        tank.x2 -= 20;
        tank.x3 -= 20;
        tank.x4 -= 20;
    } 
    else if(e.key==="ArrowLeft" && counterTank===1 && tank.x4>0 && fieldArray[(tank.x4/20)-1][tank.y4/20]!==1
            && fieldArray[(tank.x1/20)-1][tank.y1/20]!==1 && fieldArray[(tank.x3/20)-1][tank.y3/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2-20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5-20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2-20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5-20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2-20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5-20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2-20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5-20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        tank.x1 -= 20;
        tank.x2 -= 20;
        tank.x3 -= 20;
        tank.x4 -= 20;
    } 
    else if(e.key==="ArrowLeft" && counterTank===2 && tank.x3>0 && fieldArray[(tank.x3/20)-1][tank.y3/20]!==1
            && fieldArray[(tank.x4/20)-1][tank.y4/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2-20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5-20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2-20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5-20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2-20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5-20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2-20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5-20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 -= 20;
        tank.x2 -= 20;
        tank.x3 -= 20;
        tank.x4 -= 20;
    }
    else if(e.key==="ArrowLeft" && counterTank===3 && tank.x2>0 && fieldArray[(tank.x2/20)-1][tank.y2/20]!==1
            && fieldArray[(tank.x1/20)-1][tank.y1/20]!==1 && fieldArray[(tank.x3/20)-1][tank.y3/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2-20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5-20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2-20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5-20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2-20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5-20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2-20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5-20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 -= 20;
        tank.x2 -= 20;
        tank.x3 -= 20;
        tank.x4 -= 20;
    }

    if (e.key==="ArrowRight" && counterTank===0 && tank.x3<canvas.width-20 && fieldArray[(tank.x3/20)+1][tank.y3/20]!==1 && fieldArray[(tank.x4/20)+1][tank.y4/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tank.x1+2+20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5+20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2+20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5+20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2+20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5+20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2+20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5+20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 += 20;
        tank.x2 += 20;
        tank.x3 += 20;
        tank.x4 += 20;
    }
    else if(e.key==="ArrowRight" && counterTank===1 && tank.x2<canvas.width-20 && fieldArray[(tank.x2/20)+1][tank.y2/20]!==1
            && fieldArray[(tank.x1/20)+1][tank.y1/20]!==1 && fieldArray[(tank.x3/20)+1][tank.y3/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2+20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5+20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2+20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5+20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2+20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5+20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2+20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5+20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 += 20;
        tank.x2 += 20;
        tank.x3 += 20;
        tank.x4 += 20;
    }
    else if(e.key==="ArrowRight" && counterTank===2 && tank.x1<canvas.width-20 && fieldArray[(tank.x1/20)+1][tank.y1/20]!==1 && fieldArray[(tank.x4/20)+1][tank.y4/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2+20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5+20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2+20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5+20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2+20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5+20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2+20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5+20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5, tank.width-10, tank.height-10);

        tank.x1 += 20;
        tank.x2 += 20;
        tank.x3 += 20;
        tank.x4 += 20;
    }
    else if(e.key==="ArrowRight" && counterTank===3 && tank.x4<canvas.width-20 && fieldArray[(tank.x4/20)+1][tank.y4/20]!==1
            && fieldArray[(tank.x1/20)+1][tank.y1/20]!==1 && fieldArray[(tank.x3/20)+1][tank.y3/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.strokeRect(tank.x1+2+20, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5+20, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2+20, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5+20, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2+20, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5+20, tank.y3+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2+20, tank.y4+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5+20, tank.y4+5, tank.width-10, tank.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tank.x1+2, tank.y1+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2, tank.y2+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5, tank.y2+5, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5, tank.width-10, tank.height-10);

        tank.x1 += 20;
        tank.x2 += 20;
        tank.x3 += 20;
        tank.x4 += 20;
    }

    if(e.key==="ArrowDown" && counterTank===0 && tank.y4!==canvas.height-20 && fieldArray[tank.x1/20][tank.y1/20+1]!==1 &&
    fieldArray[tank.x3/20][tank.y3/20+1]!==1 && fieldArray[tank.x4/20][tank.y4/20+1]!==1)
    {
        tank.y1 += 20;
        tank.y2 += 20;
        tank.y3 += 20;
        tank.y4 += 20;
        tank.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x1+2, tank.y1+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x2+2, tank.y2+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x2+5, tank.y2+5-20, tank.width-10, tank.height-10);
    }
    else if(e.key==="ArrowDown" && counterTank===1 && tank.y3!==canvas.height-20 && fieldArray[tank.x3/20][tank.y3/20+1]!==1 && 
            fieldArray[tank.x4/20][tank.y4/20+1]!==1)
    {
        tank.y1 += 20;
        tank.y2 += 20;
        tank.y3 += 20;
        tank.y4 += 20;
        tank.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x1+2, tank.y1+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5-20, tank.width-10, tank.height-10);
    }
    else if(e.key==="ArrowDown" && counterTank===2 && tank.y1!==canvas.height-20 && tank.y2!==canvas.height-20 && tank.y3!==canvas.height-20
            && fieldArray[tank.x1/20][tank.y1/20+1]!==1 && fieldArray[tank.x2/20][tank.y2/20+1]!==1 && fieldArray[tank.x3/20][tank.y3/20+1]!==1)
    {
        tank.y1 += 20;
        tank.y2 += 20;
        tank.y3 += 20;
        tank.y4 += 20;
        tank.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x1+2, tank.y1+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x1+5, tank.y1+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x3+2, tank.y3+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5-20, tank.width-10, tank.height-10);
    }
    else if(e.key==="ArrowDown" && counterTank===3 && tank.y1!==canvas.height-20 && fieldArray[tank.x1/20][tank.y1/20+1]!==1
            && fieldArray[tank.x4/20][tank.y4/20+1]!==1)
    {
        tank.y1 += 20;
        tank.y2 += 20;
        tank.y3 += 20;
        tank.y4 += 20;
        tank.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tank.x3+2, tank.y3+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x3+5, tank.y3+5-20, tank.width-10, tank.height-10);

        ctx.strokeRect(tank.x4+2, tank.y4+2-20, tank.width-4, tank.height-4);
        ctx.fillRect(tank.x4+5, tank.y4+5-20, tank.width-10, tank.height-10);
    }
} 

function rotatetZ(e)
{
    if(e.key==="c")
    tz.rotatetZ();
}
function movetZ(e)
{
    if (e.key==="ArrowLeft" && countertZ===0 && tz.x1>0 && fieldArray[(tz.x1/20)-1][tz.y1/20]!==1 && fieldArray[(tz.x4/20)-1][tz.y4/20]!==1) 
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tz.x2+2-40, tz.y2+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x2+5-40, tz.y2+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2-40, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5-40, tz.y3+5, tz.width-10, tz.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tz.x2+2, tz.y2+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x2+5, tz.y2+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5, tz.y3+5, tz.width-10, tz.height-10);

        tz.x1 -= 20;
        tz.x2 -= 20;
        tz.x3 -= 20;
        tz.x4 -= 20;
    } 
    else if(e.key==="ArrowLeft" && countertZ===1 && tz.x4>0 && fieldArray[(tz.x1/20)-1][tz.y1/20]!==1 
            && fieldArray[(tz.x3/20)-1][tz.y3/20]!==1 && fieldArray[(tz.x4/20)-1][tz.y4/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tz.x1+2-20, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5-20, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x2+2-40, tz.y2+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x2+5-40, tz.y2+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2-20, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5-20, tz.y3+5, tz.width-10, tz.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tz.x1+2, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x2+2, tz.y2+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x2+5, tz.y2+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5, tz.y3+5, tz.width-10, tz.height-10);

        tz.x1 -= 20;
        tz.x2 -= 20;
        tz.x3 -= 20;
        tz.x4 -= 20;
    }

    if (e.key==="ArrowRight" && countertZ===0 && tz.x3<canvas.width-20 && fieldArray[(tz.x3/20)+1][tz.y3/20]!==1
        && fieldArray[(tz.x2/20)+1][tz.y2/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tz.x1+2+40, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5+40, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x4+2+40, tz.y4+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x4+5+40, tz.y4+5, tz.width-10, tz.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tz.x1+2, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x4+2, tz.y4+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x4+5, tz.y4+5, tz.width-10, tz.height-10);

        tz.x1 += 20;
        tz.x2 += 20;
        tz.x3 += 20;
        tz.x4 += 20;
    }
    else if(e.key==="ArrowRight" && countertZ===1 && tz.x2<canvas.width-20 && fieldArray[(tz.x1/20)+1][tz.y1/20]!==1 
            && fieldArray[(tz.x3/20)+1][tz.y3/20]!==1 && fieldArray[(tz.x2/20)+1][tz.y2/20]!==1)
    {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(tz.x1+2+20, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5+20, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x4+2+40, tz.y4+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x4+5+40, tz.y4+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2+20, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5+20, tz.y3+5, tz.width-10, tz.height-10);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tz.x1+2, tz.y1+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5, tz.y1+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x4+2, tz.y4+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x4+5, tz.y4+5, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2, tz.y3+2, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5, tz.y3+5, tz.width-10, tz.height-10);

        tz.x1 += 20;
        tz.x2 += 20;
        tz.x3 += 20;
        tz.x4 += 20;
    }

    if(e.key==="ArrowDown" && countertZ===0 && tz.y3!==canvas.height-20 && tz.y4!==canvas.height-20 && fieldArray[tz.x1/20][tz.y1/20+1]!==1
    && fieldArray[tz.x3/20][tz.y3/20+1]!==1 && fieldArray[tz.x4/20][tz.y4/20+1]!==1)
    {
        tz.y1 += 20;
        tz.y2 += 20;
        tz.y3 += 20;
        tz.y4 += 20;
        tz.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tz.x1+2, tz.y1+2-20, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5, tz.y1+5-20, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x2+2, tz.y2+2-20, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x2+5, tz.y2+5-20, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x3+2, tz.y3+2-20, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x3+5, tz.y3+5-20, tz.width-10, tz.height-10);
    }
    else if(e.key==="ArrowDown" && countertZ===1 && tz.y3!==canvas.height-20 && fieldArray[tz.x2/20][tz.y2/20+1]!==1
            && fieldArray[tz.x3/20][tz.y3/20+1]!==1)
    {  
        tz.y1 += 20;
        tz.y2 += 20;
        tz.y3 += 20;
        tz.y4 += 20;
        tz.setBlock();

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        ctx.strokeRect(tz.x1+2, tz.y1+2-20, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x1+5, tz.y1+5-20, tz.width-10, tz.height-10);

        ctx.strokeRect(tz.x4+2, tz.y4+2-20, tz.width-4, tz.height-4);
        ctx.fillRect(tz.x4+5, tz.y4+5-20, tz.width-10, tz.height-10);
    }
}

function rotatetZv(e)
{
    if(e.key==="c")
    tzv.rotatetZv();
}
function movetZv(e)
{
    if(e.key==="ArrowLeft" && countertZv===0 && tzv.x4>0 && fieldArray[(tzv.x1/20)-1][tzv.y1/20]!==1 && fieldArray[(tzv.x4/20)-1][tzv.y4/20]!==1)
    {
        tzv.x1 -= 20;
        tzv.x2 -= 20;
        tzv.x3 -= 20;
        tzv.x4 -= 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x3+2+20, tzv.y3+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x3+5+20, tzv.y3+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x2+2+20, tzv.y2+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x2+5+20, tzv.y2+5, tzv.width-10, tzv.height-10);
    }
    else if(e.key==="ArrowLeft" && countertZv===1 && tzv.x1>0 
       && fieldArray[(tzv.x1/20)-1][tzv.y1/20]!==1 && fieldArray[(tzv.x2/20)-1][tzv.y2/20]!==1 && fieldArray[(tzv.x4/20)-1][tzv.y4/20]!==1)
    {
        tzv.x1 -= 20;
        tzv.x2 -= 20;
        tzv.x3 -= 20;
        tzv.x4 -= 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x4+2+20, tzv.y4+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x4+5+20, tzv.y4+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x3+2+20, tzv.y3+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x3+5+20, tzv.y3+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x2+2+20, tzv.y2+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x2+5+20, tzv.y2+5, tzv.width-10, tzv.height-10);
    }

    if(e.key==="ArrowRight" && countertZv===0 && tzv.x2<canvas.width-20 
       && fieldArray[(tzv.x2/20)+1][tzv.y2/20]!==1 && fieldArray[(tzv.x3/20)+1][tzv.y3/20]!==1)
    {
        tzv.x1 += 20;
        tzv.x2 += 20;
        tzv.x3 += 20;
        tzv.x4 += 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x1+2-20, tzv.y1+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x1+5-20, tzv.y1+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x4+2-20, tzv.y4+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x4+5-20, tzv.y4+5, tzv.width-10, tzv.height-10);
    }
    else if(e.key==="ArrowRight" && countertZv===1 && tzv.x3<canvas.width-20 
       && fieldArray[(tzv.x2/20)+1][tzv.y2/20]!==1 && fieldArray[(tzv.x3/20)+1][tzv.y3/20]!==1 && fieldArray[(tzv.x4/20)+1][tzv.y4/20]!==1)
    {
        tzv.x1 += 20;
        tzv.x2 += 20;
        tzv.x3 += 20;
        tzv.x4 += 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x4+2-20, tzv.y4+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x4+5-20, tzv.y4+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x1+2-20, tzv.y1+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x1+5-20, tzv.y1+5, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x2+2-20, tzv.y2+2, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x2+5-20, tzv.y2+5, tzv.width-10, tzv.height-10);
    }

    if(e.key==="ArrowDown" && countertZv===0 && tzv.y3<canvas.height-20 
       && fieldArray[(tzv.x2/20)][tzv.y2/20+1]!==1 && fieldArray[(tzv.x3/20)][tzv.y3/20+1]!==1 && fieldArray[(tzv.x4/20)][tzv.y4/20+1]!==1)
    {
        tzv.y1 += 20;
        tzv.y2 += 20;
        tzv.y3 += 20;
        tzv.y4 += 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x1+2, tzv.y1+2-20, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x1+5, tzv.y1+5-20, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x2+2, tzv.y2+2-20, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x2+5, tzv.y2+5-20, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x4+2, tzv.y4+2-20, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x4+5, tzv.y4+5-20, tzv.width-10, tzv.height-10);
    }
    else if(e.key==="ArrowDown" && countertZv===1 && tzv.y4<canvas.height-20 
       && fieldArray[(tzv.x1/20)][tzv.y1/20+1]!==1 && fieldArray[(tzv.x4/20)][tzv.y4/20+1]!==1)
    {
        tzv.y1 += 20;
        tzv.y2 += 20;
        tzv.y3 += 20;
        tzv.y4 += 20;
        tzv.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(tzv.x2+2, tzv.y2+2-20, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x2+5, tzv.y2+5-20, tzv.width-10, tzv.height-10);
        ctx.strokeRect(tzv.x3+2, tzv.y3+2-20, tzv.width-4, tzv.height-4);
        ctx.fillRect(tzv.x3+5, tzv.y3+5-20, tzv.width-10, tzv.height-10);
    }
}

function movetSquare(e)
{
    if(e.key==="ArrowLeft" && fieldArray[(square.x1/20)-1][square.y1/20]!==1 && fieldArray[(square.x4/20)-1][square.y4/20]!==1)
    {
        square.x1 -= 20;
        square.x2 -= 20;
        square.x3 -= 20;
        square.x4 -= 20;
        square.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(square.x3+2+20, square.y3+2, square.width-4, square.height-4);
        ctx.fillRect(square.x3+5+20, square.y3+5, square.width-10, square.height-10);
        ctx.strokeRect(square.x2+2+20, square.y2+2, square.width-4, square.height-4);
        ctx.fillRect(square.x2+5+20, square.y2+5, square.width-10, square.height-10);
    }
    if(e.key==="ArrowRight" && fieldArray[(square.x2/20)+1][square.y2/20]!==1 && fieldArray[(square.x3/20)+1][square.y3/20]!==1)
    {
        square.x1 += 20;
        square.x2 += 20;
        square.x3 += 20;
        square.x4 += 20;
        square.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(square.x1+2-20, square.y1+2, square.width-4, square.height-4);
        ctx.fillRect(square.x1+5-20, square.y1+5, square.width-10, square.height-10);
        ctx.strokeRect(square.x4+2-20, square.y4+2, square.width-4, square.height-4);
        ctx.fillRect(square.x4+5-20, square.y4+5, square.width-10, square.height-10);
    }
    if(e.key==="ArrowDown" && square.y3<canvas.height-20 && fieldArray[(square.x4/20)][square.y4/20+1]!==1 && fieldArray[(square.x3/20)][square.y3/20+1]!==1)
    {
        square.y1 += 20;
        square.y2 += 20;
        square.y3 += 20;
        square.y4 += 20;
        square.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(square.x1+2, square.y1+2-20, square.width-4, square.height-4);
        ctx.fillRect(square.x1+5, square.y1+5-20, square.width-10, square.height-10);
        ctx.strokeRect(square.x2+2, square.y2+2-20, square.width-4, square.height-4);
        ctx.fillRect(square.x2+5, square.y2+5-20, square.width-10, square.height-10);
    }
}

function rotatetAngle(e)
{
    if(e.key==="c")
    angle.rotatetAngle();
}
function movetAngle(e)
{
    if(e.key==="ArrowLeft" && countertAngle===0 && fieldArray[(angle.x1/20)-1][angle.y1/20]!==1 && fieldArray[(angle.x3/20)-1][angle.y3/20]!==1)
    {
        angle.x1 -= 20;
        angle.x2 -= 20;
        angle.x3 -= 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2+20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5+20, angle.y3+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x2+2+20, angle.y2+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5+20, angle.y2+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowLeft" && countertAngle===1 && fieldArray[(angle.x1/20)-1][angle.y1/20]!==1 && fieldArray[(angle.x3/20)-1][angle.y3/20]!==1)
    {
        angle.x1 -= 20;
        angle.x2 -= 20;
        angle.x3 -= 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x1+2+20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5+20, angle.y1+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x2+2+20, angle.y2+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5+20, angle.y2+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowLeft" && countertAngle===2 && fieldArray[(angle.x2/20)-1][angle.y2/20]!==1 && fieldArray[(angle.x3/20)-1][angle.y3/20]!==1)
    {
        angle.x1 -= 20;
        angle.x2 -= 20;
        angle.x3 -= 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x1+2+20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5+20, angle.y1+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x3+2+20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5+20, angle.y3+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowLeft" && countertAngle===3 && fieldArray[(angle.x2/20)-1][angle.y2/20]!==1 && fieldArray[(angle.x1/20)-1][angle.y1/20]!==1)
    {
        angle.x1 -= 20;
        angle.x2 -= 20;
        angle.x3 -= 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x1+2+20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5+20, angle.y1+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x3+2+20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5+20, angle.y3+5, angle.width-10, angle.height-10);
    }

    if(e.key==="ArrowRight" && countertAngle===0 && fieldArray[(angle.x2/20)+1][angle.y2/20]!==1 && fieldArray[(angle.x3/20)+1][angle.y3/20]!==1)
    {
        angle.x1 += 20;
        angle.x2 += 20;
        angle.x3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2-20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5-20, angle.y3+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x1+2-20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5-20, angle.y1+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowRight" && countertAngle===1 && fieldArray[(angle.x2/20)+1][angle.y2/20]!==1 && fieldArray[(angle.x1/20)+1][angle.y1/20]!==1)
    {
        angle.x1 += 20;
        angle.x2 += 20;
        angle.x3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2-20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5-20, angle.y3+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x1+2-20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5-20, angle.y1+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowRight" && countertAngle===2 && fieldArray[(angle.x3/20)+1][angle.y3/20]!==1 && fieldArray[(angle.x1/20)+1][angle.y1/20]!==1)
    {
        angle.x1 += 20;
        angle.x2 += 20;
        angle.x3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2-20, angle.y3+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5-20, angle.y3+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x2+2-20, angle.y2+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5-20, angle.y2+5, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowRight" && countertAngle===3 && fieldArray[(angle.x3/20)+1][angle.y3/20]!==1 && fieldArray[(angle.x1/20)+1][angle.y1/20]!==1)
    {
        angle.x1 += 20;
        angle.x2 += 20;
        angle.x3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x1+2-20, angle.y1+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5-20, angle.y1+5, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x2+2-20, angle.y2+2, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5-20, angle.y2+5, angle.width-10, angle.height-10);
    }

    if(e.key==="ArrowDown" && countertAngle===0 && angle.y3<canvas.height-20
        && fieldArray[(angle.x1/20)][angle.y1/20+1]!==1 && fieldArray[(angle.x3/20)][angle.y3/20+1]!==1)
    {
        angle.y1 += 20;
        angle.y2 += 20;
        angle.y3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x2+2, angle.y2+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5, angle.y2+5-20, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x1+2, angle.y1+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5, angle.y1+5-20, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowDown" && countertAngle===1 && angle.y3<canvas.height-20
        && fieldArray[(angle.x2/20)][angle.y2/20+1]!==1 && fieldArray[(angle.x3/20)][angle.y3/20+1]!==1)
    {
        angle.y1 += 20;
        angle.y2 += 20;
        angle.y3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2, angle.y3+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5, angle.y3+5-20, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x1+2, angle.y1+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5, angle.y1+5-20, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowDown" && countertAngle===2 && angle.y1<canvas.height-20
        && fieldArray[(angle.x2/20)][angle.y2/20+1]!==1 && fieldArray[(angle.x1/20)][angle.y1/20+1]!==1)
    {
        angle.y1 += 20;
        angle.y2 += 20;
        angle.y3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2, angle.y3+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5, angle.y3+5-20, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x1+2, angle.y1+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x1+5, angle.y1+5-20, angle.width-10, angle.height-10);
    }
    else if(e.key==="ArrowDown" && countertAngle===3 && angle.y1<canvas.height-20
        && fieldArray[(angle.x3/20)][angle.y3/20+1]!==1 && fieldArray[(angle.x1/20)][angle.y1/20+1]!==1)
    {
        angle.y1 += 20;
        angle.y2 += 20;
        angle.y3 += 20;
        angle.setBlock();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.strokeRect(angle.x3+2, angle.y3+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x3+5, angle.y3+5-20, angle.width-10, angle.height-10);
        ctx.strokeRect(angle.x2+2, angle.y2+2-20, angle.width-4, angle.height-4);
        ctx.fillRect(angle.x2+5, angle.y2+5-20, angle.width-10, angle.height-10);
    }
}

var level = 2;
function hedge()
{
    for(var i = canvas.height/20-2; i>canvas.height/20-level; i--)
    {
        for(var j =0; j<canvas.width/20; j++)
        {
            var block = random(0,1);
            if(block===1)
            {
                fieldArray[j][i]=1;
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';

                ctx.strokeRect(j*20+2, i*20+2, 20-4, 20-4);
                ctx.fillRect(j*20+5, i*20+5, 20-10, 20-10);
            }
        }
    }
}
function selectLevel(e)
{
    if(e.key==="ArrowUp")
    {
        level++;
        if(level===21) level=2;
        var lev = level-2;
        lvl.textContent = `Level: ${lev}`;
    }
}
window.addEventListener('keydown',selectLevel);

function go()
{
    counterBlock = random(1,14);
    if(counterBlock===1) fall1();
    if(counterBlock===2) fall2();
    if(counterBlock===3) fall3();
    if(counterBlock===4) fall4();
    if(counterBlock===5) fall5();
    if(counterBlock===6) fall6();
    if(counterBlock===7) fall7();
    if(counterBlock===8) fall8();
    if(counterBlock===9) fall9();
    if(counterBlock===10) fall10();
    if(counterBlock===11) fall11();
    if(counterBlock===12) fall12();
    if(counterBlock===13) fall13();
    if(counterBlock===14) fall14();
}
function pizdets ()
{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 200, canvas.width, 80);
    ctx.fillStyle = 'black';
    ctx.font = '48px serif';
    ctx.fillText('Game over!!!', 25, 250); 
    addEventListener('keydown',selectLevel); 
    begin_game.addEventListener('click',begin);  
}
function gap()
{
    start_pause = true;
}

function advice()
{
    ctx.font = '20px serif';
    ctx.fillText('Select a level by Up arrow', 35, 250);
}
advice();
function begin()
{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i<canvas.width/20; i++)
    {
        for(var j = 0; j<canvas.height; j++)
        {
            fieldArray[i][j]=0;
        }
    }
    hedge();
    go();
    score = 0;
    scr.textContent= 'Score: 0';
    removeEventListener('keydown',selectLevel);
    begin_game.removeEventListener('click', begin);
}
begin_game.addEventListener('click',begin);