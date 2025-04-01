// 问题列表
const questions = [
    { question: "天津地铁1号线的起点站是？", answer: "刘园" },
    { question: "天津地铁2号线的标志色是什么？", answer: "黄色" },
    { question: "天津地铁3号线经过的火车站是？", answer: "天津站" }
];

let currentQuestionIndex = 0;

// 点击按钮显示问题
document.getElementById('helloask').addEventListener('click', function () {
    showQuestion();
});

// 提交答案
document.getElementById('submitAnswer').addEventListener('click', function () {
    const userAnswer = document.getElementById('modalAnswer').value.trim();
    if (userAnswer === questions[currentQuestionIndex].answer) {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            closeModal();
            showConfirmModal();
        }
    } else {
        alert("回答错误，无法进入主界面！");
        closeModal();
    }
});

// 确认进入主界面
document.getElementById('confirmButton').addEventListener('click', function () {
    document.body.classList.remove('hello-active'); // 移除 helloSection 的背景样式
    document.getElementById('helloSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
});

// 显示问题模态框
function showQuestion() {
    document.getElementById('modalQuestion').textContent = questions[currentQuestionIndex].question;
    document.getElementById('modalAnswer').value = '';
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('questionModal').style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('questionModal').style.display = 'none';
}

// 显示确认模态框
function showConfirmModal() {
    document.getElementById('confirmModal').style.display = 'block';
}

// 菜单导航栏点击事件
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // 阻止默认跳转行为

        // 获取目标内容的 ID
        const targetId = this.getAttribute('data-target');

        // 隐藏所有内容区域
        document.querySelectorAll('.content').forEach(section => {
            section.classList.remove('active');
        });

        // 显示目标内容区域
        document.getElementById(targetId).classList.add('active');
    });
});
// 获取所有菜单项
const menuItems = document.querySelectorAll('.menu ul li a');

// 获取所有内容部分
const contentSections = document.querySelectorAll('.content');

// 默认显示首页内容
document.getElementById('home').classList.add('active');



// 监听“询问”按钮的点击事件
document.getElementById('ask-btn').addEventListener('click', function() {
// 获取用户输入的问题
const question = document.getElementById('question').value;

// 如果用户输入了问题
if (question) {
// 在响应区域显示“加载中…”提示
document.getElementById('response').innerText = '加载中…';
// 发起 fetch 请求，向服务器发送问题
fetch('/ask', {
    method: 'POST', // 使用 POST 方法
    headers: {
        'Content-Type': 'application/json', // 设置请求头为 JSON 格式
    },
    body: JSON.stringify({ question: question }), // 将问题转换为 JSON 格式并发送
})
    .then(response => response.json()) // 将响应解析为 JSON 格式
    .then(data => {
        // 将服务器返回的答案显示在响应区域
        document.getElementById('response').innerText = data.answer;
    });

}
});

// 开始游戏的函数
function startGame() {
// 获取嵌入游戏的 iframe 元素
const iframe = document.getElementById('game-iframe');

// 向 iframe 发送消息，通知游戏开始
iframe.contentWindow.postMessage('start', '*');
}

// 停止游戏的函数
function stopGame() {
// 获取嵌入游戏的 iframe 元素
const iframe = document.getElementById('game-iframe');

// 向 iframe 发送消息，通知游戏停止
iframe.contentWindow.postMessage('stop', '*');
}

// 监听下拉菜单 line-select 的变化事件
document.getElementById('line-select').addEventListener('change', function() {
// 获取用户选择的线路
const selectedLine = this.value;
const stationList = document.getElementById('station-info'); // 提前获取元素

// 如果用户选择了有效的线路
if (selectedLine) {
// 发起 fetch 请求，获取 stations.json 文件的数据
fetch('data/stations.json') // 确保路径正确
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应失败');
        }
        return response.json();
    })
    .then(data => {
        // 确保数据结构正确
        const stations = data[selectedLine];
        if (stations && Array.isArray(stations)) {
            // 显示站点信息
            stationList.innerHTML = ''; // 清空之前的内容
            
            // 创建站点信息容器
            const container = document.createElement('div');
            container.className = 'station-container';
            
            stations.forEach(station => {
                const stationDiv = document.createElement('div');
                stationDiv.className = 'station';
                stationDiv.innerHTML = `
                    <div class="name">${station.name || station}</div>
                    ${station.transfer ? `<div class="transfer">可换乘: ${station.transfer}</div>` : ''}
                    ${station.feature ? `<div class="feature">特色: ${station.feature}</div>` : ''}
                `;
                container.appendChild(stationDiv);
            });
            
            stationList.appendChild(container);
        } else {
            // 如果未找到对应线路的站点信息
            stationList.innerHTML = '<p>未找到该线路的站点信息</p>';
        }
    })
    .catch(error => {
        console.error('获取站点信息失败:', error);
        stationList.innerHTML = '<p>获取站点信息失败，请稍后再试</p>';
    });
} else {
// 如果未选择线路
stationList.innerHTML = '<p>请选择一条线路</p>';
}
});