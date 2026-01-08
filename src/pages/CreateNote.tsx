import {useState} from 'react'
import PageContainer from '../components/PageContainer'
import { uploadToCloudinary } from '../utlis/uploadToCloudinary';
import {QRCodeSVG} from 'qrcode.react';
import { createNote } from '../firebase/notes';

const CreateNote = () => {

  const MAX_IMAGES = 3;
  const [text,setText] = useState('');
//  const [imageUrl,setImageUrl] = useState<File | null>(null);
  const [imageUrls,setImageUrls] = useState<File[]>([]);
  const [loading,setLoading] = useState(false);
  const [expiryHours,setExpiryHours] = useState(2);
  const [noteId,setNoteId] = useState<string | null>(null);

  const qrValue = noteId ? `${window.location.origin}/view/${noteId}` : '';

  const handleImageUpload = async() =>{
    if(imageUrls.length==0) return;
    const urls:string[] = [];
    for(const imageFile of imageUrls){
      const url = await uploadToCloudinary(imageFile);
      if(url) {
        urls.push(url);
      }
    }
    return urls;
  }

  const handleCreate = async() =>{
    if(!text.trim()) return alert("Note text is required");

    try{
      setLoading(true);
      let uploadedImageUrl:string[] = [];
      if(imageUrls.length>0) {
        uploadedImageUrl = (await handleImageUpload()) ?? [];
      }

      const id = await createNote({
        text,
        imageUrls: uploadedImageUrl,
        expiryhours: expiryHours,
      });
      setNoteId(id);

    }catch(error){
      console.error("Error creating note:",error);
      alert("Failed to create note. Please try again.");
    }finally{
      setLoading(false);
    
      }
    
  }

   
  return (
    <PageContainer>
      {
        !noteId ? (
          <div className='space-y-4'>
                  <h1 className='text-blue-950 font-bold'>Create Secure Note</h1>
                  <textarea
                    className='w-full border rounded-lg p-3'
                    rows={4}
                    placeholder='Enter your note here...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  
                  <div className="flex-col items-center justify-center w-full space-y-2">

                    {imageUrls.length < MAX_IMAGES && (
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
                      >
                        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                            />
                          </svg>

                          <p className="mb-2 text-sm">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>

                          <p className="text-xs">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>

                        <input
                          id="dropzone-file"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if(!file){
                              return;
                            }
                            if(imageUrls.length >= MAX_IMAGES){
                              alert(`You can only upload up to ${MAX_IMAGES} images.`);
                              return;
                            }
                            setImageUrls((prev)=>[...prev,file])
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                    <p className='text-sm font-medium'>
                      Images({imageUrls.length}/{MAX_IMAGES})
                    </p>
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {imageUrls.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />

                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                onClick={() =>
                                  setImageUrls((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                    )}  
                  </div>


                  <div>
                      <label className="text-sm font-medium">Expires in</label>
                      <select
                        className="w-full border rounded-lg p-2 mt-1"
                        value={expiryHours}
                        onChange={(e) => setExpiryHours(Number(e.target.value))}
                      >
                        <option value={2}>2 hours</option>
                        <option value={3}>3 hours</option>
                        <option value={4}>4 hours</option>
                      </select>
                  </div>

                  

                  <button 
                    className='w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50 cursor-pointer'
                    disabled={loading}
                    onClick={handleCreate}
                  >
                    {loading ? "Generating..." : "Generate QR"}
                  </button>
          </div>
        ):(
          <div className='space-y-4 text-center'>
              <h2 className='text-lg font-semibold'>
                 Scan to View Note
              </h2>

              <div className='flex justify-center'>
                  <QRCodeSVG value={qrValue} size={200} />
              </div>

              <p className='text-sm break-all text-gray-600'> {qrValue}</p>

               <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 underline text-sm cursor-pointer"
                >
                  Create another note
                </button>
        
          </div>
        )
      }
      
    </PageContainer>

  )
}

export default CreateNote