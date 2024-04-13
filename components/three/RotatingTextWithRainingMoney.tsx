import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Text } from '@react-three/drei';
import { useTheme } from 'next-themes';

// MoneyBill component
function MoneyBill({ texture }: any) {
  const mesh = useRef<any>(null);
  const [x, y, z] = useMemo(() => [Math.random() * 5 - 2.5, Math.random() * 5, Math.random() * 5 - 2.5], []);
  const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];

  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.position.y -= 0.02;
      if (mesh.current.position.y < -5) {
        mesh.current.position.y = 5;
      }
    }

  });

  return (
    <mesh ref={mesh} position={[x, y, z]} rotation={rotation}>
      <planeGeometry args={[0.5, 0.25]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
}

// RotatingText component with raining money effect
export default function RotatingTextWithRainingMoney({ data, center, price }: any) {
  const { theme } = useTheme()
  const [text] = useState(data);
  const moneyTexture = useLoader(TextureLoader, 'moneyTexture.jpeg');

  const ref = useRef<any>();
  const { size } = useThree();
  const [isMouseDetected, setIsMouseDetected] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const billsCount = 200; // Number of money bills you want to rain
  // const billsCount = text.usd_market_cap.toFixed(2); // Number of money bills you want to rain

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (!isMouseDetected) setIsMouseDetected(true);
      setMousePosition({
        x: (event.clientX / size.width) * 2 - 1,
        y: -(event.clientY / size.height) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, isMouseDetected]);

  useFrame(() => {
    if (ref.current !== undefined) {
      if (isMouseDetected && rotationEnabled) {

        ref.current.position.z = -4
        // If mouse is detected, rotate based on mouse position
        const { x, y } = mousePosition;
        ref.current.rotation.x = y * (Math.PI / 4); // Rotate up to 45 degrees vertically
        ref.current.rotation.y = x * (Math.PI / 4); // Rotate up to 45 degrees horizontally
      } else {
        // Default state
        ref.current.position.z = -4
        ref.current.rotation.x = 0;
        ref.current.rotation.y = 0;
        ref.current.rotation.z = 0;
      }
    }
  });

  const [rotationEnabled, setRotationEnabled] = useState(center);

  // Reset and toggle rotation
  const toggleRotation = useCallback(() => {
    setRotationEnabled(!rotationEnabled);
    if (!rotationEnabled) {
      // Reset rotation to default
      if (ref.current !== undefined && ref.current !== null) {
        ref.current.rotation.x = 0;
        ref.current.rotation.y = 0;
        ref.current.rotation.z = 0;
      }
    }
  }, [rotationEnabled]);

  useEffect(() => {
    return () => {
      toggleRotation()
    }
  }, [center, toggleRotation])

  function copy(clipboardData: any) {
    console.log(clipboardData)
    navigator.clipboard.writeText(clipboardData.toString());
    alert("Copied to Clipboard!");
  }

  return (
    <>
      {Array.from({ length: billsCount }).map((_, i) => (
        <MoneyBill key={i} texture={moneyTexture} />
      ))}
      <Text
        onClick={() => copy(text.mint)}
        ref={ref}
        color={theme === "light" ? "#000" : "#fff"}
        fontSize={0.8}
        paddingTop={20}
        maxWidth={200}
        lineHeight={0.1}
        wordSpacing={20}
        letterSpacing={0.01}
        textAlign={'center'}
        anchorX="center" // Horizontal alignment
        anchorY="middle" // Vertical alignment
      >
        {/* {`\n\n\n\n\n\n\n\n\n\nFUCK: ${JSON.stringify(text)}\n`} */}
        {`$${text.name}\n`}
        {`\n\n\n\n\n\n\n\n\n\nMint: ${text.mint}\n`}
        {`\n\n\n\n\n\n\n\n\n\nTotal Supply: ${text.total_supply}\n`}
        {`\n\n\n\n\n\n\n\n\n\nUSD MarketCap: $${text.usd_market_cap.toFixed(2)}\n`}
        {`\n\n\n\n\n\n\n\n\n\nCurve: ${text.bonding_curve}\n`}
        {`\n\n\n\n\n\n\n\n\n\n$${price}\n`}
        {text.complete && `${`\n\n\n\n\n\n\n\nRaydium Pool: ${text.raydium_pool}\n`}`}
      </Text>
    </>
  );
}
