export function getSubjectDropdownLabel(subject, boardId, gradeId) {
    const completeName =
        subject.complete_name ||
        [subject.code, subject.name].filter(Boolean).join(" - ");

    const parts = [];

    if (!boardId) parts.push(subject.grade?.board?.name);
    if (!gradeId) parts.push(subject.grade?.name);

    parts.push(completeName);

    return parts.filter(Boolean).join(" • ");
}