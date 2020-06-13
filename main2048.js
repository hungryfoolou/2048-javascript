var board = new Array();
var score=0;

//记录每个格子是否已经发生了碰撞
//一行2,2,4,8的格子往左移动，原来代码使得格子变为16，实际应该变为4,4,8
//上面的例子我没理解，不过老师的代码还是存在Bug,假如一排的数字分别为2,2,4,4得到的结果会是4,8.所以我把hasConflicted设定为1维数组，判断每行或者每列是否已经被碰撞。
var hasConflicted = new Array();

// 手机触控
var startx =0;
var starty=0;
var endx=0;
var endy=0;


$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile()
{	
	//*
	if (documentWidth>400) // 数值不能太大了
	{
		gridContainerWidth=368;
		cellSideLength=72;
		cellSpace=16;

	}
	//*/
	/*
	if (documentWidth>500) // 数值不能太大了
	{
		gridContainerWidth=500;
		cellSideLength=100;
		cellSpace=20;

	}
	*/
	$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame()
{
	//alert('test');
	// 初始化棋盘格
	init();
	//随机在两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init()
{	
	//alert('test');
	for (var i=0; i<4; i++)
		for (var j=0; j<4; j++)
		{
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop(i,j));
			gridCell.css('left', getPosLeft(i,j));
		}
	for (var i=0; i<4; i++)
	{
		board[i] = new Array();
		hasConflicted[i] = false; //默认没有发生碰撞
		for (var j=0; j<4; j++)
			board[i][j]=0;
	}

	updateBoardView();

	score=0;
		
}

function updateBoardView()
{
	$(".number-cell").remove();
	for (var i=0; i<4; i++)
		{
			// 每一轮开始之前把hasConflicted值进行重置
			hasConflicted[i] = false;

			for (var j=0; j<4; j++)
			{	// 这一行代码很容易出错，下面的连续3个点是由1个点再加2个点(英文引号)组成
				$("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
				var theNumberCell = $('#number-cell-'+i+'-'+j);

				if(board[i][j]==0)
				{
					theNumberCell.css('width', '0px');
					theNumberCell.css('height','0px');
					theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2);
					theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2);
				}
				else
				{ 	//覆盖原来的grid-cell
					theNumberCell.css('width', cellSideLength);
					theNumberCell.css('height',cellSideLength);
					theNumberCell.css('top', getPosTop(i,j));
					theNumberCell.css('left', getPosLeft(i,j));
					
					//背景色
					theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
					//前景色
					theNumberCell.css('color',getNumberColor(board[i][j]));
					theNumberCell.text(board[i][j]);
				}

			}
		}
	// number-cell原始属性在css文件中，这里需更新
	$('.number-cell').css('line-height', cellSideLength+'px');
	$('.number-cell').css('font-size', 0.6*cellSideLength+'px');
}

function generateOneNumber()
{	
	//alert('test');
	if(nospace(board))
	{
		return false;
	}

	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4)); //向下取整，生成0-3的整数
	var randy = parseInt(Math.floor(Math.random()*4)); 

	var times=0
	while(times<50) //为了提高效率，不用while(true)死循环
	{
		if(board[randx][randy]==0)
			break;
		randx = parseInt(Math.floor(Math.random()*4)); 
		randy = parseInt(Math.floor(Math.random()*4)); 

		times++;
	}
	if (times==50)//循环50次都没有找到随机位置，则人工找位置
	{
		for (var i=0;i<4;i++)
			for(var j=0;i<4;j++)
			{
				if (board[i][j]==0)
				{
					randx = i;
					randy = j;

				}
			}	

	}


	//随机一个数字(2或4)
	var randNumber = Math.random()<0.5?2:4;


	//在随机位置显示随机数字
	board[randx][randy] = randNumber;

	//在前端显示这个数字
	showNumberWithAnimation(randx, randy, randNumber);


	return true;
}

$(document).keydown(function(event)
{
	switch(event.keyCode)
	{
		case 37:  //left
			//如果屏幕出现下拉条，按“下”键，则游戏格子往下跑，而且右侧滚动条也在移动
			// 阻挡keydown这个动作发生时所有默认效果(默认效果包括滚动条上下左右移动)
			// 后面优化游戏时，会添加按键一些默认效果，不应该阻挡所有默认效果，要使用键盘原有设置，该代码最好放在“识别出按哪个按键之后"的代码中
			event.preventDefault();

			if (moveLeft())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 38:  //up
			event.preventDefault();
			if (moveUp())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 39:  //right
			event.preventDefault();
			if (moveRight())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 40:  //down
			event.preventDefault();
			if (moveDown())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		default:
			break;
	}
});

// 监听手机触控
document.addEventListener('touchstart', function(event)
{	
	// event.touches数组包括多个手指触控信息，这里需要1个手指信息
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;

});

//解决问题:webview touchevents are not fired propperly if e.preventDefault() is not used on touchstart and touchmove
document.addEventListener('touchmove', function(event)
{
	event.preventDefault();
});

document.addEventListener('touchend', function(event)
{
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx-startx;
	var deltay = endy-starty;

	// 用户点击"new game"按钮，或者点击屏幕，而非滑动屏幕
	if (Math.abs(deltax) <0.2*documentWidth && Math.abs(deltay) < 0.2*documentWidth)
	{
		return;
	}

	// x轴移动距离 大于 y轴移动距离，说明手指在x轴滑动
	if (Math.abs(deltax) >= Math.abs(deltay))
	{
		if (deltax > 0)  //x轴正方向滑动
		{
			//move right
			if (moveRight())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}
		else
		{
			//move left
			if (moveLeft())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}
	}
	else
	{
		if(deltay > 0) // 在屏幕坐标中Y轴正向是向下的
		{
			//move down
			if (moveDown())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		} 
		else
		{
			//move up
			if (moveUp())
			{
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}


	}

});

function isgameover()
{
	if (nospace(board) & nomove(board)) // 无空间并且不能移动
	{
		gameover();
	}
}

function gameover()
{
	alert('gameover!');
}

function moveLeft()
{
	if (!canMoveLeft(board))
	{
		return false;
	}
	
	//moveLeft
	for (var i=0; i<4; i++)
		for (var j=1; j<4; j++)  //j从1开始，因为最左边1列不能往左走，不必判断
		{
			if (board[i][j] != 0)
			{
				for (k=0;k<j;k++)
				{	
					// 左侧值为0
					if (board[i][k]==0 && noBlockHorizontal(i,k,j,board)) //board[i][j]与board[i][k]之间没有障碍物
					{
						//move
						showMoveAnimation(i,j, i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					// 左侧值与本格值相等
					else if (board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)  && !hasConflicted[i]) 
					{
						//move
						showMoveAnimation(i,j, i,k);

						//add叠加，比如2与2叠加为4
						board[i][k]=board[i][k] + board[i][j];
						board[i][j]=0;

						//add score
						score += board[i][k] //数值为上面叠加后的数值
						updateScore(score); // 分数返回到前端页面

						hasConflicted[i]=true;
						
						continue;
					}
				}
			}
		}

	//不要忘记重置前端页面
	//要等到上面的showMoveAnimation()把动画展示完了再执行该行代码
	setTimeout("updateBoardView()",200); //200毫秒刚好与showMoveAnimation()的200一致

	return true;

}


function moveRight()
{
	if (!canMoveRight(board))
	{
		return false;
	}
	
	//moveRight
	for (var i=0; i<4; i++)
		for (var j=2; j>=0; j--)  //j从2开始，因为最右边1列不能往右走，不必判断
		{
			if (board[i][j] != 0)
			{
				for (k=3;k>j;k--)  //k从3而不是2开始
				{	
					// 右侧值为0
					if (board[i][k]==0 && noBlockHorizontal(i,j, k,board)) //交换之前函数的j和k的顺序
					{
						//move
						showMoveAnimation(i,j, i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					// 右侧值与本格值相等
					else if (board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i]) 
					{
						//move
						showMoveAnimation(i,j, i,k);

						//add，比如2与2叠加为4
						board[i][k]=board[i][k] + board[i][j];
						board[i][j]=0;

						//add score
						score += board[i][k] //数值为上面叠加后的数值
						updateScore(score); // 分数返回到前端页面

						hasConflicted[i] = true;

						continue;
					}
				}
			}
		}

	//不要忘记重置前端页面
	//要等到上面的showMoveAnimation()把动画展示完了再执行该行代码
	setTimeout("updateBoardView()",200); //200毫秒刚好与showMoveAnimation()的200一致

	return true;

}


function moveUp()
{
	if (!canMoveUp(board))
	{
		return false;
	}
	
	//moveUp
	for (var i=0; i<4; i++)  //i表示列，j表示行
		for (var j=1; j<4; j++)  //j从1开始，因为最上边1行不能往上走，不必判断
		{
			if (board[j][i] != 0)
			{
				for (k=0;k<j;k++)
				{	
					// 上侧值为0
					if (board[k][i]==0 && noBlockVertical(k,j, i,board)) //board[j][i]与board[k][i]之间（同一列之间）没有障碍物
					{
						//move
						showMoveAnimation(j,i, k, i);
						board[k][i]=board[j][i];
						board[j][i]=0;
						continue;
					}
					// 左侧值与本格值相等
					else if (board[k][i]==board[j][i] && noBlockVertical(k,j, i,board) && !hasConflicted[i]) 
					{
						//move
						showMoveAnimation(j,i, k, i);

						//add，比如2与2叠加为4
						board[k][i]=board[k][i] + board[j][i];
						board[j][i]=0;

						//add score
						score += board[k][i] //数值为上面叠加后的数值
						updateScore(score); // 分数返回到前端页面

						hasConflicted[i]=true;

						continue;
					}
				}
			}
		}

	//不要忘记重置前端页面
	//要等到上面的showMoveAnimation()把动画展示完了再执行该行代码
	setTimeout("updateBoardView()",200); //200毫秒刚好与showMoveAnimation()的200一致

	return true;

}


function moveDown()
{
	if (!canMoveDown(board))
	{
		return false;
	}
	
	//moveDown
	for (var i=0; i<4; i++)  //i表示列，j表示行
		for (var j=2; j>=0; j--)  //j从2开始，因为最下边1行不能往下走，不必判断
		{
			if (board[j][i] != 0)
			{
				for (k=3;k>j;k--)
				{	
					// 下侧值为0
					if (board[k][i]==0 && noBlockVertical(j,k, i,board)) //board[j][i]与board[k][i]之间（同一列之间）没有障碍物
					{
						//move
						showMoveAnimation(j,i, k, i);
						board[k][i]=board[j][i];
						board[j][i]=0;
						continue;
					}
					// 左侧值与本格值相等
					else if (board[k][i]==board[j][i] && noBlockVertical(j,k, i,board) && !hasConflicted[i]) 
					{
						//move
						showMoveAnimation(j,i, k, i);

						//add，比如2与2叠加为4
						board[k][i]=board[k][i] + board[j][i];
						board[j][i]=0;

						//add score
						score += board[k][i] //数值为上面叠加后的数值
						updateScore(score); // 分数返回到前端页面

						hasConflicted[i]=true;

						continue;
					}
				}
			}
		}

	//不要忘记重置前端页面
	//要等到上面的showMoveAnimation()把动画展示完了再执行该行代码
	setTimeout("updateBoardView()",200); //200毫秒刚好与showMoveAnimation()的200一致

	return true;

}