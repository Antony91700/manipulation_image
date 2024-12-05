import React, { useRef, useState, useEffect } from 'react';
    import { Box, Button, Flex, Input, VStack, useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
    import { SunIcon, MoonIcon } from '@chakra-ui/icons';
    import { ZoomIn, ZoomOut } from 'lucide-react';

    const App = () => {
      const { colorMode, toggleColorMode } = useColorMode();
      const bgColor = useColorModeValue('gray.100', 'gray.800');
      const [imageSrc, setImageSrc] = useState(null);
      const [zoomLevel, setZoomLevel] = useState(1);
      const canvasRef = useRef(null);
      const [isDragging, setIsDragging] = useState(false);
      const [lastX, setLastX] = useState(0);
      const [lastY, setLastY] = useState(0);
      const [offsetX, setOffsetX] = useState(0);
      const [offsetY, setOffsetY] = useState(0);

      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target.result);
        };
        reader.readAsDataURL(file);
      };

      const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 0.1);
      };

      const handleZoomOut = () => {
        setZoomLevel(Math.max(0.1, zoomLevel - 0.1));
      };

      const handleMouseDown = (event) => {
        setIsDragging(true);
        setLastX(event.clientX - offsetX);
        setLastY(event.clientY - offsetY);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      const handleMouseMove = (event) => {
        if (isDragging) {
          setOffsetX(event.clientX - lastX);
          setOffsetY(event.clientY - lastY);
        }
      };

      const handleExport = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'mesure.png';
        link.href = canvas.toDataURL();
        link.click();
      };

      useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => {
            canvas.width = 800;
            canvas.height = 600;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
          };
        }
      }, [imageSrc]);

      useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(zoomLevel, zoomLevel);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.restore();
          };
        }
      }, [zoomLevel, offsetX, offsetY, imageSrc]);

      return (
        <Flex h="100vh" bg={bgColor} color={useColorModeValue('gray.800', 'white')}>
          <Box flex="1" p="4">
            <Box className="canvas-container">
              <canvas
                ref={canvasRef}
                className="canvas"
                width="800"
                height="600"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              ></canvas>
            </Box>
          </Box>
          <Box flex="1" p="4">
            <VStack spacing="4" align="stretch">
              <IconButton
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                aria-label="Toggle dark mode"
              />
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              <Flex justify="space-between">
                <Button colorScheme="teal" onClick={handleZoomIn}>Zoom In</Button>
                <Button colorScheme="red" onClick={handleZoomOut}>Zoom Out</Button>
              </Flex>
              <Button colorScheme="blue" onClick={handleExport}>Export Image</Button>
            </VStack>
          </Box>
        </Flex>
      );
    };

    export default App;
