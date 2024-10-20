import { Circle, Group, Rect } from "fabric";

export const draggableBar = (fWidth: number, fHeight: number) => {
    const rects: Rect[] = [];

    const baseLine = fHeight * 0.9; // 矩形的底部基准线
    const barWidth = fWidth * 0.035; // 矩形的宽度
    const spacing = fWidth * 0; // 矩形的间隔

    // 可以放置的最多矩形数量
    const count = Math.floor(fWidth / (barWidth + spacing));
    Array.from({ length: count }, (_, i) => {
        // 高度从低到高再到低
        const baseHeight = i < count / 2 ? 20 + i : 20 + (count - 1 - i);
        const rectHeight = (fHeight * baseHeight) / 100;

        const rect = new Rect({
            left: i * (barWidth + spacing),
            top: baseLine - rectHeight, // 确保矩形底部在同一水平线上
            width: barWidth,
            height: rectHeight,
            stroke: "#ffffff",
            strokeWidth: 2
        });

        rects.push(rect);
    });

    const group = new Group(rects, {
        selectable: true
    });

    const { width, height } = group.getBoundingRect();
    group.set({
        left: (fWidth - width) / 2, // 水平居中
        top: fHeight - height // 最底部
    });

    return group;
}

export const draggableWave = (fWidth: number, fHeight: number) => {
    const circles: Circle[] = [];

    const radius = 4;
    const padding = fWidth * 0.015; // 预留两侧间距
    const count = Math.floor((fWidth - 2 * padding) / (radius * 2));

    Array.from({ length: count }, (_, i) => {
        const cx = padding + (i * (fWidth - 2 * padding)) / (count - 1);
        const cy = fHeight / 2 + 20 * Math.sin((i * Math.PI) / 8);

        const circle = new Circle({
            left: cx,
            top: cy,
            radius: radius
        });

        circles.push(circle);
    });

    const group = new Group(circles, {
        selectable: true
    });

    const { width } = group.getBoundingRect();
    group.set({
        left: (fWidth - width) / 2
    });

    return group;
}