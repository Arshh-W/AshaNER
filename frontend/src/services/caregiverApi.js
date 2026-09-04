import api from "./api";

export const getPatients = async () => {
    return api.get("/caregiver/patients");
};

export const getPatient = async (
    patientId
) => {
    return api.get(
        `/caregiver/patients/${patientId}`
    );
};

export const createPatient = async (
    patientData
) => {
    return api.post(
        "/caregiver/patients",
        patientData
    );
};

export const updatePatient = async (
    patientId,
    patientData
) => {
    return api.put(
        `/caregiver/patients/${patientId}`,
        patientData
    );
};

export const deletePatient = async (
    patientId
) => {
    return api.delete(
        `/caregiver/patients/${patientId}`
    );
};

export const getPatientProgress = async (
    patientId
) => {
    return api.get(
        `/caregiver/patients/${patientId}/progress`
    );
};

export const getPatientHistory = async (
    patientId
) => {
    return api.get(
        `/caregiver/patients/${patientId}/history`
    );
};

export default {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientProgress,
    getPatientHistory
};