import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ALGERIAN_LEVELS, getSubjectsForProfile } from '../constants/educationData';
import { getCurriculumForSubject } from '../constants/curriculaData';
import { storageService, storageEvents } from '../services/storageService';

const EducationContext = createContext();

export const EducationProvider = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const [educationLevels, setEducationLevels] = useState(() => storageService.getEducationLevels());
  
  // Current active selections for student
  const [activeLevel, setActiveLevel] = useState(user?.level || '2AS');
  const [activeStream, setActiveStream] = useState(user?.stream || 'tech');
  const [activeSpec, setActiveSpec] = useState(user?.specialization || 'meca');
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (user?.level) setActiveLevel(user.level);
    if (user?.stream) setActiveStream(user.stream);
    if (user?.specialization) setActiveSpec(user.specialization);
  }, [user]);

  useEffect(() => {
    const unsub = storageEvents.on('studentos_education_levels', (levels) => {
      setEducationLevels(levels);
    });
    return () => unsub();
  }, []);

  // Compute available subjects based on current profile
  const currentSubjects = getSubjectsForProfile(activeLevel, activeStream, activeSpec);

  // Helper to change student profile
  const setEducationProfile = ({ level, stream, specialization, streamName, specializationName }) => {
    setActiveLevel(level);
    setActiveStream(stream);
    setActiveSpec(specialization);
    updateUserProfile({
      level,
      stream,
      specialization,
      streamName,
      specializationName
    });
  };

  // Helper to get curriculum
  const getCurriculum = (subjectId) => {
    return getCurriculumForSubject(activeLevel, activeStream, activeSpec, subjectId);
  };

  return (
    <EducationContext.Provider
      value={{
        educationLevels,
        activeLevel,
        activeStream,
        activeSpec,
        currentSubjects,
        selectedSubject,
        setSelectedSubject,
        setEducationProfile,
        getCurriculum,
      }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => useContext(EducationContext);
