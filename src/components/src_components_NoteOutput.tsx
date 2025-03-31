import React, { useState, useEffect } from 'react';
import './NoteOutput.css';

interface NoteOutputProps {
  transcript: string;
}

const NoteOutput: React.FC<NoteOutputProps> = ({ transcript }) => {
  const [formattedNote, setFormattedNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (transcript) {
      formatToSOAP(transcript);
    }
  }, [transcript]);

  // Format the transcript into the specified SOAP note structure
  const formatToSOAP = async (text: string) => {
    setIsLoading(true);
    try {
      // Get current date in UTC and format as specified
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 10);
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const dateTime = `${formattedDate} ${formattedTime}`;

      // Create a header with basic metadata
      const header = `# Clinical Note\n**Date/Time:** ${dateTime}\n**Provider:** ${document.cookie.includes('username') ? document.cookie.split('username=')[1].split(';')[0] : 'Provider'}\n\n`;
      
      // Create the structured SOAP note sections
      const soapNote = `
# Subjective
- **HPI (History of Present Illness):** ${extractSection(text, 'HPI', 'history of present illness')}
- **PMH (Past Medical History):** ${extractSection(text, 'PMH', 'past medical history')}
- **Meds (Medications):** ${extractSection(text, 'medications', 'meds')}
- **Allergies:** ${extractSection(text, 'allergies')}

# Objective
- **Cardinal Impression:** ${extractSection(text, 'cardinal impression', 'impression')}
- **Review of Systems:**
  - **Neuro (Neurological):** ${extractSection(text, 'neuro', 'neurological')}
  - **CV (Cardiovascular):** ${extractSection(text, 'cv', 'cardiovascular', 'heart')}
  - **Pulm (Pulmonary):** ${extractSection(text, 'pulm', 'pulmonary', 'respiratory', 'lungs')}
  - **GI/GU (Gastrointestinal/Genitourinary):** ${extractSection(text, 'gi', 'gu', 'gastrointestinal', 'genitourinary', 'abdomen')}
  - **MSK/Integ (Musculoskeletal/Integumentary):** ${extractSection(text, 'msk', 'skin', 'musculoskeletal', 'integumentary')}
- **Vital Signs:**
  - **BP (Blood Pressure):** ${extractVitalSign(text, 'bp', 'blood pressure')}
  - **HR (Heart Rate):** ${extractVitalSign(text, 'hr', 'heart rate', 'pulse')}
  - **SpO₂ (Oxygen Saturation):** ${extractVitalSign(text, 'spo2', 'o2', 'oxygen', 'sat')}
  - **cBg (Capillary Blood Glucose):** ${extractVitalSign(text, 'cbg', 'glucose', 'sugar')}
  - **EtCO₂ (End-Tidal Carbon Dioxide):** ${extractVitalSign(text, 'etco2', 'co2')}
- **ECG (Electrocardiogram):**
  - **Rate/Rhythm:** ${extractECGDetail(text, 'rate', 'rhythm')}
  - **Electrical Intervals:** ${extractECGDetail(text, 'interval', 'pr', 'qrs', 'qt')}
  - **Axis:** ${extractECGDetail(text, 'axis')}
  - **R Zone:** ${extractECGDetail(text, 'r zone', 'r wave')}
  - **Ectopy:** ${extractECGDetail(text, 'ectopy', 'pvc', 'pac')}
  - **ST Aberrancy:** ${extractECGDetail(text, 'st', 'elevation', 'depression')}

# Assessment
- **D/dx (Differential Diagnosis):** ${extractSection(text, 'differential', 'diagnosis', 'ddx', 'd/dx')}
- **Medical Decision Making:** ${extractSection(text, 'medical decision', 'mdm', 'decision making')}

# Plan
- **Summary of Events:** ${extractSection(text, 'plan', 'summary', 'events')}
`;

      setFormattedNote(header + soapNote);
    } catch (error) {
      console.error('Error formatting note:', error);
      setFormattedNote('Error formatting note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract sections from transcript
  const extractSection = (text: string, ...keywords: string[]): string => {
    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Look for sections that might contain these keywords
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]+(.*?)(?=\\n\\n|$)`, 'i');
      const match = lowerText.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Search for sentences containing the keywords
    for (const keyword of keywords) {
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(keyword)) {
          return sentence.trim();
        }
      }
    }
    
    return '[Not documented]';
  };

  // Helper function to extract vital signs
  const extractVitalSign = (text: string, ...keywords: string[]): string => {
    // Look for patterns like "BP: 120/80" or "blood pressure is 120/80"
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]+(\\d+[/\\d]*\\s*(?:mmHg|bpm|%|mg/dl)?)`, 'i');
      const match = text.toLowerCase().match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '[Not documented]';
  };

  // Helper function to extract ECG details
  const extractECGDetail = (text: string, ...keywords: string[]): string => {
    const lowerText = text.toLowerCase();
    const ecgSection = extractSection(lowerText, 'ecg', 'electrocardiogram', 'ekg');
    
    if (ecgSection !== '[Not documented]') {
      for (const keyword of keywords) {
        const regex = new RegExp(`${keyword}[:\\s]+(.*?)(?=\\n|$)`, 'i');
        const match = ecgSection.match(regex);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }
    
    // If no specific ECG section, look throughout the text
    return extractSection(text, ...keywords);
  };

  // Function to render markdown as HTML
  const renderMarkdown = (markdown: string) => {
    // Split content by headings to render each section
    const sections = markdown.split(/^# /gm).filter(Boolean);
    
    return (
      <div className="markdown-content">
        {sections.map((section, index) => {
          const [title, ...content] = section.split('\n');
          
          return (
            <div key={index} className="soap-section">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={{ 
                __html: content.join('\n')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                  .replace(/<li>/g, '<ul><li>').replace(/<\/li>\n/g, '</li></ul>\n')
                  .replace(/\n{2,}/g, '<br /><br />')
                  .replace(/\n/g, '<br />')
              }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="note-output">
      <h2>Clinical Note</h2>
      {isLoading ? (
        <div className="loading">Formatting note...</div>
      ) : (
        <div className="note-content">
          {formattedNote ? (
            <div className="formatted-note">
              <div className="soap-note">
                {renderMarkdown(formattedNote)}
              </div>
              <div className="note-actions">
                <button onClick={() => navigator.clipboard.writeText(formattedNote)}>
                  Copy to Clipboard
                </button>
                <button onClick={() => {
                  const blob = new Blob([formattedNote], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'SOAP_Clinical_Note.md';
                  a.click();
                }}>
                  Download as Markdown
                </button>
              </div>
            </div>
          ) : (
            <div className="placeholder">No transcript available. Start a conversation to generate a clinical note.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteOutput;