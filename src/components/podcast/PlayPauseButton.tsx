import React from "react";

interface SpotifyPlayerUIProps {
  isPlaying: boolean;
  currentTime?: string;
  duration?: string;
  title?: string;
  artist?: string;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PlayPauseButton: React.FC<SpotifyPlayerUIProps> = ({
  isPlaying,
  currentTime = "0:00",
  duration = "3:45",
  title = "Podcast Title",
  artist = "Author Name",
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  return (
    <div style={styles.container}>
      {/* LEFT - Track Info */}
      <div style={styles.left}>
        <div style={styles.cover} />
        <div>
          <div style={styles.title}>{title}</div>
          <div style={styles.artist}>{artist}</div>
        </div>
      </div>

      {/* CENTER - Controls */}
      <div style={styles.center}>
        <div style={styles.controls}>
          <IconButton onClick={onPrevious}>
            <PrevIcon />
          </IconButton>

          <PlayButton isPlaying={isPlaying} onClick={onPlayPause} />

          <IconButton onClick={onNext}>
            <NextIcon />
          </IconButton>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressWrapper}>
          <span style={styles.time}>{currentTime}</span>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
          <span style={styles.time}>{duration}</span>
        </div>
      </div>

      {/* RIGHT - Volume */}
      <div style={styles.right}>
        <VolumeIcon />
        <div style={styles.volumeBar}>
          <div style={styles.volumeFill} />
        </div>
      </div>
    </div>
  );
};

const PlayButton = ({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean;
  onClick?: () => void;
}) => (
  <button onClick={onClick} style={styles.playButton}>
    {isPlaying ? <PauseIcon /> : <PlayIcon />}
  </button>
);

const IconButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button onClick={onClick} style={styles.iconButton}>
    {children}
  </button>
);

/* ================== STYLES ================== */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    zIndex: 50,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#181818",
    borderTop: "1px solid #282828",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "white",
    fontFamily: "sans-serif",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    width: "30%",
  },
  cover: {
    width: 56,
    height: 56,
    backgroundColor: "#333",
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  artist: {
    fontSize: 12,
    color: "#b3b3b3",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "white",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#b3b3b3",
  },
  progressWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#404040",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    width: "35%",
    height: "100%",
    backgroundColor: "#1DB954",
  },
  time: {
    fontSize: 11,
    color: "#b3b3b3",
    width: 40,
    textAlign: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "30%",
    justifyContent: "flex-end",
  },
  volumeBar: {
    width: 100,
    height: 4,
    backgroundColor: "#404040",
    borderRadius: 2,
  },
  volumeFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#1DB954",
  },
};

/* ================== ICONS ================== */

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3b3b3">
    <path d="M6 6h2v12H6zm3.5 6L18 18V6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3b3b3">
    <path d="M16 6h2v12h-2zM6 6v12l8.5-6z" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3">
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
  </svg>
);
