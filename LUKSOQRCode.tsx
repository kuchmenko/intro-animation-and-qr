import React, { useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { Svg, Rect, Circle, Image as SvgImage } from 'react-native-svg';
import QRCodeGenerator from 'qrcode-generator';
interface LUKSOQRCodeProps {
    data: string;
    size?: number;
    logo: ImageSourcePropType;
    logoSize?: number;
    logoBorderWidth?: number;
    logoPadding?: number;
    foregroundColor?: string;
    backgroundColor?: string;
}

const LUKSOQRCode: React.FC<LUKSOQRCodeProps> = ({
                                                           data,
                                                           size = 200,
                                                           logo,
                                                           logoSize = 50,
                                                           logoBorderWidth = 2,
    logoPadding = 5,
                                                           foregroundColor = '#000000',
                                                           backgroundColor = '#FFFFFF',
                                                       }) => {
    const [qrCode, setQRCode] = useState<QRCodeGenerator | null>(null);

    useEffect(() => {
        const qr = QRCodeGenerator(0, 'H');
        qr.addData(data);
        qr.make();
        setQRCode(qr);
    }, [data]);


    /**
     * This function identify if the current cell is within the eye pattern
     * @param row
     * @param col
     */
    const isEyePattern = (row: number, col: number) => {
        const cornerEyeSize = 7;
        const topLeftEye = row < cornerEyeSize && col < cornerEyeSize;
        const topRightEye = row < cornerEyeSize && col >= qrCode.getModuleCount() - cornerEyeSize;
        const bottomLeftEye = row >= qrCode.getModuleCount() - cornerEyeSize && col < cornerEyeSize;

        return topLeftEye || topRightEye || bottomLeftEye;
    };

    /**
     * This function draws the eyes in circle form
     * @param cx
     * @param cy
     * @param radius
     * @param key
     */
    const drawEye = (cx: number, cy: number, radius: number, key: string) => {
        const outerCircleRadius = radius;
        const innerCircleRadius = radius * 0.5;
        const paddingRadius = radius * 0.8;

        return (
            <>
                <Circle
                    key={`${key}-outer`}
                    cx={cx}
                    cy={cy}
                    r={outerCircleRadius}
                    fill={foregroundColor}
                />
                <Circle
                    key={`${key}-padding`}
                    cx={cx}
                    cy={cy}
                    r={paddingRadius}
                    fill={backgroundColor}
                />
                <Circle
                    key={`${key}-inner`}
                    cx={cx}
                    cy={cy}
                    r={innerCircleRadius}
                    fill={foregroundColor}
                />
            </>
        );
    };

    /**
     * This function identify if the current cell is within the logo area
     * @param row
     * @param col
     */
    const isWithinLogoArea = (row: number, col: number) => {
        const moduleCount = qrCode.getModuleCount();
        const cellSize = size / moduleCount;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        const x = col * cellSize;
        const y = row * cellSize;

        return (
            x >= logoX - logoPadding - logoBorderWidth &&
            x <= logoX + logoSize + logoPadding + logoBorderWidth &&
            y >= logoY - logoPadding - logoBorderWidth &&
            y <= logoY + logoSize + logoPadding + logoBorderWidth
        );
    };

    const renderQRCode = () => {
        if (!qrCode) return null;

        const moduleCount = qrCode.getModuleCount();
        const cellSize = size / moduleCount;
        const dotRadius = cellSize / 2;

        const elements = [];
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qrCode.isDark(row, col)) {
                    if (isEyePattern(row, col) || isWithinLogoArea(row, col)) {
                        // Skip rendering eyes and modules within logo padding
                        continue;
                    } else {
                        // Render normal dots
                        elements.push(
                            <Circle
                                key={`${row}-${col}`}
                                cx={col * cellSize + dotRadius}
                                cy={row * cellSize + dotRadius}
                                r={dotRadius}
                                fill={foregroundColor}
                            />
                        );
                    }
                }
            }
        }

        // Add eye elements separately
        const eyeRadius = (7 * cellSize) / 2;
        elements.push(drawEye(eyeRadius, eyeRadius, eyeRadius, 'top-left-eye'));
        elements.push(drawEye(size - eyeRadius, eyeRadius, eyeRadius, 'top-right-eye'));
        elements.push(drawEye(eyeRadius, size - eyeRadius, eyeRadius, 'bottom-left-eye'));

        return elements;
    };


    /**
     * This function renders the logo with padding and border
     */
    const renderLogo = () => {
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        return (
            <>
                <Rect
                    x={logoX - logoPadding - logoBorderWidth}
                    y={logoY - logoPadding - logoBorderWidth}
                    width={logoSize + 2 * logoPadding + 2 * logoBorderWidth}
                    height={logoSize + 2 * logoPadding + 2 * logoBorderWidth}
                    fill={backgroundColor}
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={(logoSize + logoBorderWidth) / 2}
                    fill={backgroundColor}
                    stroke={foregroundColor}
                    strokeWidth={logoBorderWidth}
                />
                <SvgImage
                    x={logoX}
                    y={logoY}
                    width={logoSize}
                    height={logoSize}
                    href={logo}
                />
            </>
        );
    };


    return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Rect width={size} height={size} fill={backgroundColor} />
            {renderQRCode()}
            {renderLogo()}
        </Svg>
    );
};

export default LUKSOQRCode;
