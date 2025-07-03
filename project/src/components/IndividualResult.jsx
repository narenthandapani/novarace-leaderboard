import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Award, Clock, Trophy, User, Hash, Zap, TrendingDown, Camera } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { runners, raceInfo } from '../data/raceData';

const IndividualResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const badgeRef = useRef(null);
  const fullResultRef = useRef(null);
  
  const runner = runners.find(r => r.id === parseInt(id));
  
  if (!runner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Runner not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-purple-900 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors"
          >
            Back to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = `Check out ${runner.name}'s amazing result at ${raceInfo.name}!`;
  const shareDescription = `Finished the ${runner.category} race in ${runner.finishTime} with a pace of ${runner.pace}. 🏃‍♂️🏆`;

  const getCategoryColor = (category) => {
    switch(category) {
      case '5km': return 'bg-green-500';
      case '10km': return 'bg-blue-500';
      case '21km': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const generateCertificate = async () => {
    const doc = new jsPDF();
    
    // Certificate content
    doc.setFontSize(24);
    doc.text('CERTIFICATE OF ACHIEVEMENT', 105, 40, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('This is to certify that', 105, 70, { align: 'center' });
    
    doc.setFontSize(28);
    doc.text(runner.name, 105, 100, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`has successfully completed the ${runner.category} race`, 105, 130, { align: 'center' });
    doc.text(`at ${raceInfo.name}`, 105, 150, { align: 'center' });
    doc.text(`on ${raceInfo.date}`, 105, 170, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Finish Time: ${runner.finishTime}`, 105, 200, { align: 'center' });
    doc.text(`Pace: ${runner.pace}`, 105, 215, { align: 'center' });
    doc.text(`Rank: ${runner.rank} in ${runner.category}`, 105, 230, { align: 'center' });
    
    doc.save(`${runner.name}_Certificate.pdf`);
  };

  const generateBadge = async () => {
    const element = badgeRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      width: 400,
      height: 300,
    });
    
    const link = document.createElement('a');
    link.download = `${runner.name}_Badge.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateScreenshot = async () => {
    const element = fullResultRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: '#1e1b4b',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    
    const link = document.createElement('a');
    link.download = `${runner.name}_FullResult.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareDescription}\n\n${shareUrl}`);
      alert('Result copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="hidden sm:inline">Back to Leaderboard</span>
          </button>
        </div>

        {/* Full Result Container for Screenshot */}
        <div ref={fullResultRef} className="space-y-8">
          {/* Main Result Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{runner.name}</h1>
              <p className="text-xl text-purple-200">{raceInfo.name}</p>
              <p className="text-lg text-purple-300">{raceInfo.date}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 mb-3 inline-block">
                  <Hash className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-200 text-sm">Bib Number</p>
                <p className="text-2xl font-bold text-white">{runner.bibNumber}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 mb-3 inline-block">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-200 text-sm">Category</p>
                <p className="text-2xl font-bold text-white">{runner.category}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 mb-3 inline-block">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-200 text-sm">Finish Time</p>
                <p className="text-2xl font-bold text-white">{runner.finishTime}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 mb-3 inline-block">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-200 text-sm">Rank</p>
                <p className="text-2xl font-bold text-white">#{runner.rank}</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-purple-200 text-sm">Pace</p>
                <p className="text-xl font-bold text-white">{runner.pace}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-purple-200 text-sm">Age</p>
                <p className="text-xl font-bold text-white">{runner.age}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-purple-200 text-sm">Overall Rank</p>
                <p className="text-xl font-bold text-white">#{runner.overallRank}</p>
              </div>
            </div>
          </div>

          {/* Split Details Section */}
          {runner.splits && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-bold text-white">Split Details</h3>
                <span className={`${getCategoryColor(runner.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {runner.category}
                </span>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {runner.splits.map((split, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {split.isFastest && (
                          <div className="bg-green-500 rounded-full p-1">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {split.isSlowest && (
                          <div className="bg-red-500 rounded-full p-1">
                            <TrendingDown className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-white font-bold text-lg min-w-[60px]">
                          {split.distance}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{split.splitTime}</p>
                        <p className="text-purple-200 text-sm">Split Time</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{split.timeOfDay}</p>
                      <p className="text-purple-200 text-sm">Time of Day</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Split Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-200 text-sm">Fastest Split</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 rounded-full p-1">
                    <TrendingDown className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-200 text-sm">Slowest Split</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Circular Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={generateCertificate}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Download className="w-6 h-6" />
            </button>
            <span className="text-white text-sm text-center font-medium">Certificate</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={generateBadge}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Award className="w-6 h-6" />
            </button>
            <span className="text-white text-sm text-center font-medium">Badge</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={copyToClipboard}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <span className="text-white text-sm text-center font-medium">Share</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={generateScreenshot}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Camera className="w-6 h-6" />
            </button>
            <span className="text-white text-sm text-center font-medium">Screenshot</span>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mt-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Share on Social Media</h3>
          <div className="flex justify-center gap-4">
            <FacebookShareButton url={shareUrl} quote={shareTitle} hashtag="#NovaRace">
              <FacebookIcon size={48} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={['NovaRace', 'Running', 'Marathon']}>
              <TwitterIcon size={48} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>
          </div>
        </div>

        {/* Hidden Badge for Export */}
        <div
          ref={badgeRef}
          className="hidden fixed top-0 left-0 w-96 h-72 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl"
        >
          <div className="text-center h-full flex flex-col justify-center">
            <div className="bg-white/20 rounded-full p-3 mb-4 inline-block mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{runner.name}</h2>
            <p className="text-lg mb-1">{raceInfo.name}</p>
            <p className="text-sm mb-3">{raceInfo.date}</p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">Finished {runner.category} in</p>
              <p className="text-2xl font-bold">{runner.finishTime}</p>
              <p className="text-sm">Rank #{runner.rank}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualResult;