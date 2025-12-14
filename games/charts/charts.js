// Grafik ve Veri Görselleştirme

document.addEventListener('DOMContentLoaded', () => {
    let currentChart = 'line';
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');

    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentChart = btn.dataset.chart;
            chartButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('draw-chart-btn').addEventListener('click', () => {
        drawChart();
    });

    function parseData() {
        const input = document.getElementById('data-input').value;
        const lines = input.split('\n').filter(line => line.trim());
        const data = [];

        lines.forEach(line => {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                const label = parts[0];
                const value = parseFloat(parts[1]);
                if (!isNaN(value)) {
                    data.push({ label, value });
                }
            }
        });

        return data;
    }

    function drawChart() {
        const data = parseData();
        if (data.length === 0) {
            alert('Lütfen geçerli veriler girin!');
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (currentChart) {
            case 'line':
                drawLineChart(data);
                break;
            case 'bar':
                drawBarChart(data);
                break;
            case 'pie':
                drawPieChart(data);
                break;
        }
    }

    function drawLineChart(data) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const maxValue = Math.max(...data.map(d => d.value));
        const stepX = chartWidth / (data.length - 1);

        // Eksenler
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Çizgi
        ctx.strokeStyle = '#30cfd0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = canvas.height - padding - (item.value / maxValue) * chartHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Noktalar
        ctx.fillStyle = '#330867';
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = canvas.height - padding - (item.value / maxValue) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Etiketler
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            ctx.save();
            ctx.translate(x, canvas.height - padding + 20);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(item.label, 0, 0);
            ctx.restore();
        });

        // Değerler
        ctx.textAlign = 'right';
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = canvas.height - padding - (item.value / maxValue) * chartHeight;
            ctx.fillText(item.value, x - 5, y - 5);
        });
    }

    function drawBarChart(data) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = chartWidth / data.length * 0.8;
        const spacing = chartWidth / data.length * 0.2;

        // Eksenler
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Sütunlar
        const colors = ['#30cfd0', '#330867', '#7b2cbf', '#c77dff', '#e0aaff'];
        data.forEach((item, index) => {
            const x = padding + index * (barWidth + spacing) + spacing / 2;
            const height = (item.value / maxValue) * chartHeight;
            const y = canvas.height - padding - height;

            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, height);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x, y, barWidth, height);

            // Etiketler
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + barWidth / 2, canvas.height - padding + 20);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(item.label, 0, 0);
            ctx.restore();

            // Değerler
            ctx.textAlign = 'center';
            ctx.fillText(item.value, x + barWidth / 2, y - 5);
        });
    }

    function drawPieChart(data) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;
        const total = data.reduce((sum, item) => sum + item.value, 0);

        let currentAngle = -Math.PI / 2;
        const colors = ['#30cfd0', '#330867', '#7b2cbf', '#c77dff', '#e0aaff', '#ff6b6b', '#4ecdc4'];

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Etiketler
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, labelX, labelY);
            
            ctx.font = '12px Arial';
            const percentage = ((item.value / total) * 100).toFixed(1);
            ctx.fillText(`${percentage}%`, labelX, labelY + 15);

            currentAngle += sliceAngle;
        });
    }
});

