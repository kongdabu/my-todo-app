import { useState, useEffect, useRef } from 'react'
import { Paperclip, Download, Trash2, Upload } from 'lucide-react'
import { useTodoStore } from '../../store/todoStore'
import { supabase } from '../../lib/supabaseClient'

export default function FileAttachments({ todoId }) {
  const { uploadFile, fetchFiles, deleteFile } = useTodoStore()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (todoId) fetchFiles(todoId).then(setFiles)
  }, [fetchFiles, todoId])

  const handleFiles = async (selected) => {
    setError(null)
    for (const file of selected) {
      setUploading(true)
      const result = await uploadFile(todoId, file)
      if (result.error) {
        setError(result.error)
        break
      }
    }
    setUploading(false)
    fetchFiles(todoId).then(setFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles([...e.dataTransfer.files])
  }

  const handleDownload = async (file) => {
    const { data, error: signedError } = await supabase.storage
      .from('todo-attachments')
      .createSignedUrl(file.storage_path, 60)
    if (signedError || !data?.signedUrl) return
    const a = document.createElement('a')
    a.href = data.signedUrl
    a.download = file.name
    a.click()
  }

  const handleDelete = async (file) => {
    const { error: delError } = await deleteFile(file.id, file.storage_path)
    if (!delError) setFiles((prev) => prev.filter((f) => f.id !== file.id))
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 block">첨부 파일</label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-gray-300 rounded-lg px-3 py-3 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Upload size={16} className="mx-auto text-gray-400 mb-1" />
        <p className="text-xs text-gray-400">
          {uploading ? '업로드 중...' : '클릭하거나 파일을 드래그하세요 (최대 10MB)'}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles([...e.target.files])}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file) => (
            <li key={file.id} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Paperclip size={12} className="shrink-0 text-gray-400" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-gray-400 shrink-0">{formatSize(file.size)}</span>
              <button
                onClick={() => handleDownload(file)}
                className="text-blue-500 hover:text-blue-700 shrink-0"
                aria-label="다운로드"
              >
                <Download size={13} />
              </button>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-400 hover:text-red-600 shrink-0"
                aria-label="삭제"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
