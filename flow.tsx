"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SecurityNode = ({ x, y, title, tasks, color }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <rect x={x - 100} y={y - 40} width={200} height={80} rx={10} fill={color} />
      <text x={x} y={y - 15} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">
        {title}
      </text>
      <text x={x} y={y + 10} textAnchor="middle" fill="white" fontSize={12}>
        {isHovered ? "Hover to see tasks" : "Security System"}
      </text>
      {isHovered && (
        <foreignObject x={x - 95} y={y + 45} width={190} height={100}>
          <div className="bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
            <strong>Tasks:</strong>
            <ul className="list-disc list-inside">
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </foreignObject>
      )}
    </g>
  )
}

const Arrow = ({ start, end, label }) => {
  if (!start || !end) return null

  const dx = end.x - start.x
  const dy = end.y - start.y
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <g>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#4a5568" />
        </marker>
      </defs>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#4a5568"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <text
        x={(start.x + end.x) / 2}
        y={(start.y + end.y) / 2 - 10}
        textAnchor="middle"
        fill="#4a5568"
        fontSize={12}
      >
        {label}
      </text>
    </g>
  )
}

const DataPacket = ({ path, delay }) => (
  <motion.circle
    r={6}
    fill="#3498db"
    initial={{ offsetDistance: "0%" }}
    animate={{ offsetDistance: "100%" }}
    transition={{ duration: 5, delay, ease: "linear", repeat: Infinity }}
    style={{ offsetPath: `path("${path}")` }}
  />
)

export default function SecurityFlowDiagram() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const nodes = [
    {
      title: "User / External",
      x: 100,
      y: 100,
      color: "#3498db",
      tasks: ["Initiate HTTPS request", "Provide authentication"]
    },
    {
      title: "CDN / WAF",
      x: 100,
      y: 250,
      color: "#2ecc71",
      tasks: ["DDoS protection", "Bot detection", "IP reputation check"]
    },
    {
      title: "Load Balancer",
      x: 100,
      y: 400,
      color: "#e74c3c",
      tasks: ["SSL termination", "Traffic distribution", "Health checks"]
    },
    {
      title: "API Gateway",
      x: 300,
      y: 250,
      color: "#f39c12",
      tasks: ["Request routing", "API key validation", "Rate limiting"]
    },
    {
      title: "Identity Provider",
      x: 300,
      y: 400,
      color: "#9b59b6",
      tasks: ["Authentication", "Token issuance", "MFA enforcement"]
    },
    {
      title: "Application Server",
      x: 500,
      y: 250,
      color: "#1abc9c",
      tasks: ["Request processing", "Business logic execution", "Data validation"]
    },
    {
      title: "Database",
      x: 500,
      y: 400,
      color: "#34495e",
      tasks: ["Data storage", "Access control", "Encryption at rest"]
    }
  ]

  const arrows = [
    { start: nodes[0], end: nodes[1], label: "HTTPS Request" },
    { start: nodes[1], end: nodes[2], label: "Filtered Traffic" },
    { start: nodes[2], end: nodes[3], label: "Load Balanced" },
    { start: nodes[3], end: nodes[4], label: "Auth Request" },
    { start: nodes[4], end: nodes[5], label: "Authenticated" },
    { start: nodes[5], end: nodes[6], label: "Data Query" },
  ]

  const path = "M100,140 L100,370 C100,385 115,400 130,400 L470,400 C485,400 500,385 500,370 L500,290"

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Security Systems Flow Diagram</h1>
      <svg width="700" height="500" viewBox="0 0 700 500" className="bg-white shadow-lg rounded-lg">
        {arrows.map((arrow, index) => (
          <Arrow key={index} start={arrow.start} end={arrow.end} label={arrow.label} />
        ))}
        <path d={path} stroke="#bdc3c7" strokeWidth={2} fill="none" />
        {isAnimating && (
          <>
            <DataPacket path={path} delay={0} />
            <DataPacket path={path} delay={1.5} />
            <DataPacket path={path} delay={3} />
          </>
        )}
        {nodes.map((node, index) => (
          <SecurityNode key={index} x={node.x} y={node.y} title={node.title} tasks={node.tasks} color={node.color} />
        ))}
      </svg>
      <p className="mt-4 text-sm text-gray-600">Hover over each node to see the security tasks performed.</p>
    </div>
  )
}
