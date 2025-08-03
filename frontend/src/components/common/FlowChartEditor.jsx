import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// 유틸리티 함수들
const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateDistance = (p1, p2) =>
    Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const getConnectionPoints = (node) => ({
    top: { x: node.position.x + node.width / 2, y: node.position.y },
    bottom: { x: node.position.x + node.width / 2, y: node.position.y + node.height },
    left: { x: node.position.x, y: node.position.y + node.height / 2 },
    right: { x: node.position.x + node.width, y: node.position.y + node.height / 2 }
});

// 드래그 가능한 노드 컴포넌트
const FlowchartNode = ({ node, onSelect, onDelete, isSelected }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: node.id,
        data: { type: 'node', node }
    });

    const style = {
        position: 'absolute',
        left: node.position.x + (transform?.x || 0),
        top: node.position.y + (transform?.y || 0),
        width: node.width,
        height: node.height,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const getShapeElement = () => {
        const commonProps = {
            onClick: () => onSelect(node.id),
            className: `cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
            }`,
            style: {
                fill: node.fill || '#ffffff',
                stroke: node.stroke || '#333333',
                strokeWidth: 2
            }
        };

        switch (node.type) {
            case 'diamond':
                const cx = node.width / 2;
                const cy = node.height / 2;
                return (
                    <polygon
                        points={`${cx},0 ${node.width},${cy} ${cx},${node.height} 0,${cy}`}
                        {...commonProps}
                    />
                );
            case 'circle':
                return (
                    <ellipse
                        cx={node.width / 2}
                        cy={node.height / 2}
                        rx={node.width / 2 - 2}
                        ry={node.height / 2 - 2}
                        {...commonProps}
                    />
                );
            default:
                return (
                    <rect
                        width={node.width - 4}
                        height={node.height - 4}
                        x={2}
                        y={2}
                        rx={5}
                        {...commonProps}
                    />
                );
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <svg width={node.width} height={node.height} className="overflow-visible">
                {getShapeElement()}
                <text
                    x={node.width / 2}
                    y={node.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none text-sm font-medium"
                    fill="#333"
                >
                    {node.label}
                </text>

                {/* 연결점들 */}
                <circle cx={node.width / 2} cy={0} r={4} fill="#4F46E5" opacity="0.7" />
                <circle cx={node.width / 2} cy={node.height} r={4} fill="#4F46E5" opacity="0.7" />
                <circle cx={0} cy={node.height / 2} r={4} fill="#4F46E5" opacity="0.7" />
                <circle cx={node.width} cy={node.height / 2} r={4} fill="#4F46E5" opacity="0.7" />
            </svg>

            {isSelected && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                    ×
                </button>
            )}
        </div>
    );
};

// 연결선 컴포넌트
const Connection = ({ connection, nodes }) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    if (!sourceNode || !targetNode) return null;

    const sourcePoints = getConnectionPoints(sourceNode);
    const targetPoints = getConnectionPoints(targetNode);

    // 가장 가까운 연결점들 찾기
    let minDistance = Infinity;
    let bestSource = sourcePoints.right;
    let bestTarget = targetPoints.left;

    Object.entries(sourcePoints).forEach(([sourceKey, sourcePoint]) => {
        Object.entries(targetPoints).forEach(([targetKey, targetPoint]) => {
            const distance = calculateDistance(sourcePoint, targetPoint);
            if (distance < minDistance) {
                minDistance = distance;
                bestSource = sourcePoint;
                bestTarget = targetPoint;
            }
        });
    });

    // 베지어 곡선 생성
    const dx = bestTarget.x - bestSource.x;
    const dy = bestTarget.y - bestSource.y;
    const curve = Math.abs(dx) * 0.3;

    const path = `M ${bestSource.x},${bestSource.y} 
                C ${bestSource.x + curve},${bestSource.y} 
                  ${bestTarget.x - curve},${bestTarget.y} 
                  ${bestTarget.x},${bestTarget.y}`;

    return (
        <g>
            <path
                d={path}
                stroke="#666"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
            />
        </g>
    );
};

// 메인 플로우차트 에디터
const FlowchartEditor = () => {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [history, setHistory] = useState([{ nodes: [], connections: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [mode, setMode] = useState('select'); // 'select', 'connect'
    const [connectingFrom, setConnectingFrom] = useState(null);
    const fileInputRef = useRef(null);

    // 드롭 가능한 캔버스
    const { setNodeRef: setCanvasRef } = useDroppable({ id: 'canvas' });

    // 히스토리 저장
    const saveToHistory = useCallback((newNodes, newConnections) => {
        const newState = { nodes: newNodes, connections: newConnections };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    // 실행 취소/다시 실행
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const state = history[newIndex];
            setNodes(state.nodes);
            setConnections(state.connections);
            setHistoryIndex(newIndex);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const state = history[newIndex];
            setNodes(state.nodes);
            setConnections(state.connections);
            setHistoryIndex(newIndex);
        }
    }, [history, historyIndex]);

    // 키보드 이벤트 처리
    useEffect(() => {
        const handleKeyboard = (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    undo();
                } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodes.length > 0) {
                    deleteNodes(selectedNodes);
                }
            } else if (e.key === 'Escape') {
                setSelectedNodes([]);
                setMode('select');
                setConnectingFrom(null);
            }
        };

        document.addEventListener('keydown', handleKeyboard);
        return () => document.removeEventListener('keydown', handleKeyboard);
    }, [undo, redo, selectedNodes]);

    // 노드 추가
    const addNode = useCallback((type, position = { x: 100, y: 100 }) => {
        const newNode = {
            id: generateId(),
            type: type,
            position: position,
            width: type === 'diamond' ? 120 : 100,
            height: type === 'diamond' ? 80 : 60,
            label: `${type === 'diamond' ? '결정' : type === 'circle' ? '과정' : '단계'}`,
            fill: '#ffffff',
            stroke: '#333333'
        };

        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        saveToHistory(newNodes, connections);
    }, [nodes, connections, saveToHistory]);

    // 노드 삭제
    const deleteNodes = useCallback((nodeIds) => {
        const newNodes = nodes.filter(node => !nodeIds.includes(node.id));
        const newConnections = connections.filter(
            conn => !nodeIds.includes(conn.source) && !nodeIds.includes(conn.target)
        );
        setNodes(newNodes);
        setConnections(newConnections);
        setSelectedNodes([]);
        saveToHistory(newNodes, newConnections);
    }, [nodes, connections, saveToHistory]);

    // 드래그 처리
    const handleDragEnd = useCallback((event) => {
        const { active, delta } = event;

        if (active.data.current?.type === 'node') {
            const newNodes = nodes.map(node =>
                node.id === active.id
                    ? {
                        ...node,
                        position: {
                            x: node.position.x + delta.x,
                            y: node.position.y + delta.y,
                        },
                    }
                    : node
            );
            setNodes(newNodes);
            saveToHistory(newNodes, connections);
        }
    }, [nodes, connections, saveToHistory]);

    // 노드 선택
    const selectNode = useCallback((nodeId) => {
        if (mode === 'connect') {
            if (!connectingFrom) {
                setConnectingFrom(nodeId);
            } else if (connectingFrom !== nodeId) {
                // 연결 생성
                const newConnection = {
                    id: generateId(),
                    source: connectingFrom,
                    target: nodeId
                };
                const newConnections = [...connections, newConnection];
                setConnections(newConnections);
                setConnectingFrom(null);
                setMode('select');
                saveToHistory(nodes, newConnections);
            }
        } else {
            setSelectedNodes([nodeId]);
        }
    }, [mode, connectingFrom, connections, nodes, saveToHistory]);

    // SVG 내보내기
    const exportToSVG = useCallback(() => {
        const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
          </marker>
        </defs>
        ${connections.map(conn => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);
            if (!sourceNode || !targetNode) return '';

            const sourcePoints = getConnectionPoints(sourceNode);
            const targetPoints = getConnectionPoints(targetNode);
            const bestSource = sourcePoints.right;
            const bestTarget = targetPoints.left;

            const dx = bestTarget.x - bestSource.x;
            const curve = Math.abs(dx) * 0.3;

            return `<path d="M ${bestSource.x},${bestSource.y} 
                            C ${bestSource.x + curve},${bestSource.y} 
                              ${bestTarget.x - curve},${bestTarget.y} 
                              ${bestTarget.x},${bestTarget.y}"
                        stroke="#666" stroke-width="2" fill="none" 
                        marker-end="url(#arrowhead)" />`;
        }).join('')}
        ${nodes.map(node => {
            let shape = '';
            if (node.type === 'diamond') {
                const cx = node.position.x + node.width / 2;
                const cy = node.position.y + node.height / 2;
                shape = `<polygon points="${cx},${node.position.y} ${node.position.x + node.width},${cy} ${cx},${node.position.y + node.height} ${node.position.x},${cy}" 
                               fill="${node.fill}" stroke="${node.stroke}" stroke-width="2" />`;
            } else if (node.type === 'circle') {
                shape = `<ellipse cx="${node.position.x + node.width/2}" cy="${node.position.y + node.height/2}" 
                               rx="${node.width/2 - 2}" ry="${node.height/2 - 2}"
                               fill="${node.fill}" stroke="${node.stroke}" stroke-width="2" />`;
            } else {
                shape = `<rect x="${node.position.x + 2}" y="${node.position.y + 2}" 
                           width="${node.width - 4}" height="${node.height - 4}" rx="5"
                           fill="${node.fill}" stroke="${node.stroke}" stroke-width="2" />`;
            }

            return shape + `<text x="${node.position.x + node.width/2}" y="${node.position.y + node.height/2}"
                                text-anchor="middle" dominant-baseline="middle" 
                                font-size="14" font-weight="500" fill="#333">
                            ${node.label}
                          </text>`;
        }).join('')}
      </svg>
    `;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flowchart.svg';
        link.click();
        URL.revokeObjectURL(url);
    }, [nodes, connections]);

    // SVG 가져오기 (단순 버전)
    const importFromSVG = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // 간단한 JSON 형태로 저장된 데이터 파싱 (실제로는 더 복잡한 SVG 파싱 필요)
                const content = e.target.result;
                if (content.includes('<!-- FLOWCHART_DATA:')) {
                    const dataMatch = content.match(/<!-- FLOWCHART_DATA:(.*?) -->/s);
                    if (dataMatch) {
                        const data = JSON.parse(dataMatch[1]);
                        setNodes(data.nodes || []);
                        setConnections(data.connections || []);
                        saveToHistory(data.nodes || [], data.connections || []);
                    }
                }
            } catch (error) {
                alert('SVG 파일을 읽을 수 없습니다.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }, [saveToHistory]);

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col">
            {/* 툴바 */}
            <div className="bg-white shadow-sm border-b p-4 flex items-center gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => addNode('rectangle')}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        사각형 추가
                    </button>
                    <button
                        onClick={() => addNode('diamond')}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        다이아몬드 추가
                    </button>
                    <button
                        onClick={() => addNode('circle')}
                        className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        원형 추가
                    </button>
                </div>

                <div className="border-l pl-4 flex gap-2">
                    <button
                        onClick={() => setMode(mode === 'connect' ? 'select' : 'connect')}
                        className={`px-3 py-2 rounded ${
                            mode === 'connect'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {mode === 'connect' ? '연결 모드 (ESC로 취소)' : '연결 모드'}
                    </button>
                </div>

                <div className="border-l pl-4 flex gap-2">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        실행 취소 (Ctrl+Z)
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        다시 실행 (Ctrl+Y)
                    </button>
                </div>

                <div className="border-l pl-4 flex gap-2">
                    <button
                        onClick={exportToSVG}
                        className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                        SVG 내보내기
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".svg"
                        onChange={importFromSVG}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                        SVG 가져오기
                    </button>
                </div>

                <div className="ml-auto text-sm text-gray-600">
                    선택된 노드: {selectedNodes.length} | Delete로 삭제 | 드래그로 이동
                </div>
            </div>

            {/* 캔버스 */}
            <div className="flex-1 relative overflow-hidden">
                <DndContext onDragEnd={handleDragEnd}>
                    <div
                        ref={setCanvasRef}
                        className="w-full h-full relative bg-white"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setSelectedNodes([]);
                                setConnectingFrom(null);
                            }
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="10"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                                </marker>
                            </defs>
                            {connections.map(connection => (
                                <Connection
                                    key={connection.id}
                                    connection={connection}
                                    nodes={nodes}
                                />
                            ))}
                        </svg>

                        {nodes.map(node => (
                            <FlowchartNode
                                key={node.id}
                                node={node}
                                onSelect={selectNode}
                                onDelete={(nodeId) => deleteNodes([nodeId])}
                                isSelected={selectedNodes.includes(node.id)}
                            />
                        ))}

                        {connectingFrom && (
                            <div className="absolute top-4 left-4 bg-orange-100 border border-orange-300 rounded p-2 text-sm">
                                연결할 대상 노드를 클릭하세요 (ESC로 취소)
                            </div>
                        )}
                    </div>
                </DndContext>
            </div>
        </div>
    );
};

export default FlowchartEditor;