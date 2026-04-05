import React, {memo} from 'react';
import {Box, Chip, Stack, Typography} from "@mui/material";
import moment from "../../lib/dayjs.js";
import RenderAttachment from "./RenderAttachment.jsx";
import {motion} from "framer-motion";
import {userTheme} from "../../constants/userTheme.constant.js";

const MessageComponent = ({message, loggedUser}) => {
  const {sender, content, attachments = [], createdAt, e2eeState, readBy = []} = message;
  const isSameSender = sender?._id === loggedUser?._id;
  const timeAgo = moment(createdAt).fromNow();
  const readersExcludingSender = readBy.filter(
    (entry) => entry?.userId?.toString?.() !== sender?._id?.toString?.()
  );
  const readReceiptLabel = isSameSender
    ? readersExcludingSender.length > 1
      ? `Seen by ${readersExcludingSender.length}`
      : readersExcludingSender.length === 1
        ? "Seen"
        : "Sent"
    : "";
  const statusLabel = e2eeState === "encrypted"
    ? "Encrypted"
    : e2eeState === "legacy"
      ? "Legacy"
      : e2eeState === "unavailable"
        ? "Secure message unavailable"
        : "";
  const statusStyles = e2eeState === "encrypted"
    ? {
        color: "#67e8f9",
        borderColor: "rgba(103, 232, 249, 0.35)",
        backgroundColor: "rgba(34, 211, 238, 0.08)",
      }
    : e2eeState === "legacy"
      ? {
          color: "#fbbf24",
          borderColor: "rgba(251, 191, 36, 0.35)",
          backgroundColor: "rgba(251, 191, 36, 0.08)",
        }
      : {
          color: "#fda4af",
          borderColor: "rgba(251, 113, 133, 0.35)",
          backgroundColor: "rgba(251, 113, 133, 0.08)",
        };

  return (
    <motion.div
      initial={{opacity: 0, x: "-100%"}}
      whileInView={{opacity: 1, x: 0}}
      style={{
        alignSelf: isSameSender ? "flex-end" : "flex-start",
        background: isSameSender
          ? "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(94, 234, 212, 0.14) 100%)"
          : "rgba(10, 19, 32, 0.9)",
        color: userTheme.text,
        borderRadius: "1rem",
        padding: "0.75rem 0.9rem",
        width: "fit-content",
        maxWidth: "min(34rem, 80%)",
        border: `1px solid ${isSameSender ? userTheme.borderStrong : userTheme.border}`,
        boxShadow: "0 10px 30px rgba(2, 8, 23, 0.18)",
      }}
    >
      <Stack direction="row" spacing={0.8} alignItems="center" mb={statusLabel ? 0.5 : 0.3}>
        {!isSameSender && (
          <Typography fontWeight={700} variant="caption" sx={{color: userTheme.accentBlue, display: "block"}}>
            {sender.name}
          </Typography>
        )}
        {statusLabel && (
          <Chip
            label={statusLabel}
            size="small"
            variant="outlined"
            sx={{
              height: "1.35rem",
              fontSize: "0.68rem",
              ...statusStyles,
            }}
          />
        )}
      </Stack>

      {content && (<Typography sx={{whiteSpace: "pre-wrap"}}>{content}</Typography>)}

      {attachments.length > 0 && (
        attachments.map((attachment, index) => (
          <Box key={index} mt={0.8}>
            <RenderAttachment attachment={attachment} userId={loggedUser?._id}/>
          </Box>
        ))
      )}

      <Typography variant={"caption"} sx={{color: userTheme.textMuted, display: "block", mt: 0.5}}>
        {readReceiptLabel ? `${timeAgo} | ${readReceiptLabel}` : timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
