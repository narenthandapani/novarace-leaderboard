import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { runners, raceInfo } from '../data/raceData';

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate = useNavigate();

  const filteredRunners = selectedCategory === 'All' 
    ? runners 
    : runners.filter(runner => runner.category === selectedCategory);

  const topRunners = filteredRunners.slice(0, 8);
  const allRunners = filteredRunners;

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-white font-bold text-lg">#{rank}</span>;
    }
  };

  const handleViewResult = (runnerId) => {
    navigate(`/result/${runnerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {raceInfo.name}
          </h1>
          <p className="text-xl text-purple-200 mb-2">{raceInfo.date} • {raceInfo.location}</p>
          <p className="text-lg text-purple-300">{raceInfo.weather}</p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Desktop Filter */}
            <div className="hidden md:flex gap-2">
              {['All', ...raceInfo.categories].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Filter Dropdown */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
                {selectedCategory}
                {showFilterDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-lg shadow-xl z-10">
                  {['All', ...raceInfo.categories].map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-purple-100 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        selectedCategory === category ? 'bg-purple-200 text-purple-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top 8 Leaderboard */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            🏆 Top Finishers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topRunners.map((runner, index) => (
              <div
                key={runner.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleViewResult(runner.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(runner.rank)}
                    <div>
                      <h3 className="text-xl font-bold text-white">{runner.name}</h3>
                      <p className="text-purple-200">Bib #{runner.bibNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{runner.finishTime}</p>
                    <p className="text-purple-200">{runner.pace}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {runner.category}
                  </span>
                  <span className="text-purple-200">Age {runner.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Participants Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <button
            onClick={() => setShowAllParticipants(!showAllParticipants)}
            className="flex items-center justify-between w-full mb-6 text-left"
          >
            <h3 className="text-2xl font-bold text-white">
              All Participants ({allRunners.length})
            </h3>
            {showAllParticipants ? 
              <ChevronUp className="w-6 h-6 text-white" /> : 
              <ChevronDown className="w-6 h-6 text-white" />
            }
          </button>
          
          {showAllParticipants && (
            <div className="space-y-3">
              {allRunners.map((runner) => (
                <div
                  key={runner.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewResult(runner.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold text-lg min-w-[40px]">
                      #{runner.overallRank}
                    </span>
                    <div>
                      <h4 className="text-white font-semibold">{runner.name}</h4>
                      <p className="text-purple-200 text-sm">
                        Bib #{runner.bibNumber} • {runner.category} • Age {runner.age}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{runner.finishTime}</p>
                    <p className="text-purple-200 text-sm">{runner.pace}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;