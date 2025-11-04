"use client"

import { useState } from "react"
import EditorLayout from "@/components/editor/editor-layout"
import TopBar from "@/components/editor/top-bar"
import LeftSidebar from "@/components/editor/left-sidebar"
import MainCanvas from "@/components/editor/main-canvas"
import RightPanel from "@/components/editor/right-panel"
import BottomToolbar from "@/components/editor/bottom-toolbar"
import AIChatPanel from "@/components/editor/ai-chat-panel"
import CollaborationPanel from "@/components/editor/collaboration-panel"

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [selectedModel, setSelectedModel] = useState("wan-2.1")
  const [isRecording, setIsRecording] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false)

  return (
    <EditorLayout>
      <TopBar
        isRecording={isRecording}
        onRecordingToggle={setIsRecording}
        onOpenCollaboration={() => setIsCollaborationOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden bg-background">
        <LeftSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isChatOpen={isChatOpen}
          onChatToggle={setIsChatOpen}
        />
        <MainCanvas selectedModel={selectedModel} isRecording={isRecording} />
        <RightPanel selectedModel={selectedModel} onModelChange={setSelectedModel} activeTab={activeTab} />
        {isChatOpen && <AIChatPanel isOpen={isChatOpen} />}
      </div>
      <BottomToolbar />
      <CollaborationPanel isOpen={isCollaborationOpen} onClose={() => setIsCollaborationOpen(false)} />
    </EditorLayout>
  )
}
