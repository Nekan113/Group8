import { useState } from 'react'
import { History, MessageSquare } from 'lucide-react'
import { Card, Badge, Button, Modal, Textarea, EmptyState } from '../components/reusable'
import { mockCollections } from '../data/mockData'
import { formatPrice, formatDate } from '../utils/validation'

export default function RecipientHistoryPage() {
  const [collections, setCollections] = useState(mockCollections)
  const [feedbackItem, setFeedbackItem] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')

  const submitFeedback = () => {
    setCollections(collections.map((c) =>
      c.id === feedbackItem.id ? { ...c, feedback: feedbackText } : c
    ))
    setFeedbackItem(null)
    setFeedbackText('')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Collections</h1>
        <p className="text-slate-500">Your food collection history</p>
      </div>

      {collections.length === 0 ? (
        <EmptyState icon={History} title="No collections yet" description="Browse food listings and make your first reservation." />
      ) : (
        <div className="space-y-4">
          {collections.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{c.listingName}</h3>
                  <p className="text-sm text-slate-500">from {c.donorName}</p>
                  <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                    <span>Category: {c.category}</span>
                    <span>Quantity: {c.quantity} {c.unit}</span>
                    <span>Price: {formatPrice(c.pricePaid)}</span>
                    <span>Payment: {c.paymentMethod || 'N/A'}</span>
                    <span className="sm:col-span-2">Collected: {formatDate(c.collectedAt)}</span>
                  </div>
                  {c.feedback && (
                    <div className="mt-3 rounded-lg bg-aff-green-50 p-3 text-sm text-aff-green-800">
                      <MessageSquare size={14} className="mb-1 inline" /> {c.feedback}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {!c.feedback && (
                    <Button size="sm" variant="secondary" onClick={() => { setFeedbackItem(c); setFeedbackText('') }}>
                      Leave Feedback
                    </Button>
                  )}
                  <Badge variant="success">Collected</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!feedbackItem}
        onClose={() => setFeedbackItem(null)}
        title="Submit Feedback"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFeedbackItem(null)}>Cancel</Button>
            <Button onClick={submitFeedback} disabled={!feedbackText.trim()}>Submit</Button>
          </>
        }
      >
        <Textarea
          label="Your feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Share your experience with this food listing..."
          rows={4}
        />
      </Modal>
    </div>
  )
}
