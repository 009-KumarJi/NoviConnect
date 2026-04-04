import React, {useEffect, useState} from 'react';
import {FileOpen as FileOpenIcon} from "@mui/icons-material";
import {Box, CircularProgress, Typography} from "@mui/material";
import {decryptAttachmentBlob} from "../../lib/e2ee";
import {userTheme} from "../../constants/userTheme.constant.js";

const getAttachmentKind = (attachment) => {
  const source = attachment?.mimeType || attachment?.url || "";
  if (source.startsWith?.("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(source)) return "image";
  if (source.startsWith?.("video/") || /\.(mp4|webm|ogg|mov)$/i.test(source)) return "video";
  if (source.startsWith?.("audio/") || /\.(mp3|wav|ogg|aac|midi)$/i.test(source)) return "audio";
  if (source.startsWith?.("application/pdf") || /\.(pdf|doc|docx|xls|xlsx)$/i.test(source)) return "document";
  return "file";
};

const RenderAttachment = ({attachment, userId}) => {
  const [resolvedAttachment, setResolvedAttachment] = useState(() => ({
    url: attachment.url,
    mimeType: attachment.mimeType,
    originalName: attachment.originalName,
    isEncrypted: attachment.isEncrypted,
  }));
  const [isLoading, setIsLoading] = useState(Boolean(attachment.isEncrypted));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    (async () => {
      if (!attachment.isEncrypted) {
        setResolvedAttachment({
          url: attachment.url,
          mimeType: attachment.mimeType,
          originalName: attachment.originalName,
          isEncrypted: false,
        });
        setIsLoading(false);
        return;
      }

      try {
        const decrypted = await decryptAttachmentBlob({attachment, userId});
        if (!active) return;
        if (decrypted?.url?.startsWith?.("blob:")) objectUrl = decrypted.url;
        setResolvedAttachment(decrypted);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Attachment unavailable on this device.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachment, userId]);

  if (isLoading) return <CircularProgress size={20} />;
  if (error) return <Typography variant="caption" sx={{color: userTheme.danger}}>{error}</Typography>;

  const file = getAttachmentKind(resolvedAttachment);
  const url = resolvedAttachment.url;

  switch (file) {
    case "video":
      return <a href={url} target="_blank" download={resolvedAttachment.originalName || true}><video src={url} preload="metadata" width="200px" controls={true}/></a>;
    case "image":
      return <a href={url} target="_blank" download={resolvedAttachment.originalName || true}><img src={url} alt={resolvedAttachment.originalName || "attachment"} width="200px" height="150px"
                  style={{objectFit: "contain"}}/></a>;
    case "audio":
      return <a href={url} target="_blank" download={resolvedAttachment.originalName || true}><audio src={url} preload="metadata" controls={true}/></a>;
    case "document":
      return <a href={url} target="_blank" download={resolvedAttachment.originalName || true}><iframe src={url} width="200px" height="150px"/></a>;
    default:
      return <a href={url} target="_blank" download={resolvedAttachment.originalName || true} style={{color: userTheme.accent}}><Box sx={{display: "flex", alignItems: "center", gap: 0.5}}><FileOpenIcon/><span>{resolvedAttachment.originalName || "File"}</span></Box></a>;
  }
};

export default RenderAttachment;
