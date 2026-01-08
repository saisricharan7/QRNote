import {useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { getNoteById } from '../firebase/readNote';

type NoteData = {
  text:string;
  imageUrls?:string[];
  createdAt: any;
  expiresAt: any;
}

const ViewNote = () => {
    const {noteId} = useParams<{noteId:string}>();
    const [noteData,setNoteData] = useState<NoteData | null>(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [previewImg,setPreviewImg] = useState<string | null>(null);


    useEffect(() => {
      if(!noteId) return;
      // Fetch note data from backend or Firestore using noteId

      const fetchNote = async() => {
        try{
          const data = await getNoteById(noteId);
          setNoteData(data as NoteData);
        }catch(err:any){
          setError(err.message || "Failed to fetch note");
        }finally{
          setLoading(false);
        }
      }

      fetchNote();
      console.log(noteData);

    },[noteId]);

    if(loading) {
      return (
        <PageContainer>
            <p className="text-center">Loading note...</p>
        </PageContainer>
      )
    }

    if(error) {
      return (
        <PageContainer>
            <p className="text-center text-red-500">Error:{error}</p>
        </PageContainer>
      )
    }

  return (
    <PageContainer>
      <div className='space-y-4'>
        <h1 className='text-lg font-semibold text-center'>
          Secure Note
        </h1>
        <p className='text-gray-800 whitespace-pre-wrap'>
          {noteData?.text}
        </p>
        {noteData?.imageUrls && noteData.imageUrls.length>0 && (
          <div className='grid grid-cols-3 gap-2 mt-4'>
            {
              noteData.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Note Image ${index + 1}`}
                  className='w-full h-28 object-cover rounded-lg'
                  onClick={() => setPreviewImg(url)}
                />
              ))
            }
          </div>
        )}

        {previewImg && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setPreviewImg(null)}
            >
              <img
                src={previewImg}
                alt="preview"
                className="max-w-full max-h-full rounded-lg"
              />
            </div>
      )}

        <p className="text-xs text-gray-400 text-center">
          This note will expire automatically
        </p>

      </div>
    </PageContainer>


  )
}

export default ViewNote